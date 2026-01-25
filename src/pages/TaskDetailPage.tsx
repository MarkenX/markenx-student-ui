import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, RefreshCw, Trophy, Play, AlertCircle } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { studentService } from '../services/studentService';
import { taskService } from '../services/taskService';
import { Badge } from '../components/ui/Badge';
import {useSession} from "../sessions/useSession.ts";
import type {TaskServiceDTO} from "../models/dtos/TaskServiceDTO.ts";
import type {AttemptServiceDTO} from "../models/dtos/AttemptServiceDTO.ts";
import clsx from 'clsx';

export const TaskDetailPage = () => {
  const { taskId } = useParams();
  const { student } = useSession();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskServiceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<AttemptServiceDTO[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const task = await studentService.getStudentTask(student?.id, taskId);
        setTask(task || null);
      } catch (error) {
        console.error('Error cargando detalle:', error);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [student?.id, taskId]);

  useEffect(() => {
    const loadAttempts = async () => {
      if (!taskId) return;
      try {
        setAttemptsLoading(true);
        const taskAttempts = await taskService.getTaskAttempts(taskId, student?.id);
        setAttempts(taskAttempts);
      } catch (error) {
        console.error('Error cargando intentos:', error);
      } finally {
        setAttemptsLoading(false);
      }
    };
    void loadAttempts();
  }, [taskId]);

  const handleStartGame = () => {
    if (task && task.status !== 'OUTDATED' && task.currentAttempt < task.maxAttempts) {
      navigate(`/game/${task.id}`);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando información de la misión...</div>;

  if (!task)
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-700">Misión no encontrada</h2>
        <button onClick={() => navigate(-1)} className="text-brand-primary mt-4 underline">
          Volver
        </button>
      </div>
    );

  const isAttemptsLimitReached = task.currentAttempt >= task.maxAttempts;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Tareas', path: '/tasks' },
        { label: 'Detalles' }
      ]} />

      {/* Tarjeta Principal */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Cabecera */}
        <div className="bg-slate-50 p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {task.title}
              </h1>
              <Badge status={task.status} />
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2">Práctica Académica</p>
          </div>

          {/* Botón de Acción Principal */}
          <button
            onClick={handleStartGame}
            disabled={task.status === 'OUTDATED' || isAttemptsLimitReached}
            className={`
              group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 rounded-full shadow-lg focus:outline-none ring-offset-2 focus:ring-2
              ${task.status === 'OUTDATED' || isAttemptsLimitReached
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-brand-primary hover:bg-brand-secondary hover:shadow-brand-primary/40 hover:-translate-y-1'
              }
            `}
          >
            {task.status === 'OUTDATED' ? (
              <span className="flex items-center gap-2">
                <AlertCircle size={20} /> Misión Cerrada
              </span>
            ) : isAttemptsLimitReached ? (
              <span className="flex items-center gap-2">
                <AlertCircle size={20} /> Intentos agotados
              </span>
            ) : (
              <>
                <span className="mr-2 text-lg">Iniciar Misión</span>
                <Play size={20} className="fill-current group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Cuerpo de Detalles */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Descripción */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Briefing de la Misión
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">{task.summary}</p>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 className="font-bold text-blue-800 text-sm mb-1">Instrucciones Adicionales:</h4>
                <p className="text-sm text-blue-700">
                  Recuerda revisar el presupuesto inicial y las expectativas del consumidor antes de tomar
                  decisiones en la simulación. Los resultados se guardarán automáticamente al finalizar.
                </p>
              </div>
            </div>
          </div>

          {/* Métricas */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100 h-fit">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-gray-200 text-blue-600 rounded-lg shadow-sm">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Fecha Límite</p>
                <p className="font-bold text-slate-800 text-lg">
                  {new Date(task.deadline).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-gray-200 text-purple-600 rounded-lg shadow-sm">
                <RefreshCw size={24} />
              </div>
              <div className="w-full">
                <p className="text-xs font-bold text-gray-400 uppercase">Intentos Realizados</p>
                <div className="flex justify-between items-end mb-1">
                  <p className="font-bold text-slate-800 text-lg">
                    {task.currentAttempt} / {task.maxAttempts}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isAttemptsLimitReached ? 'bg-red-500' : 'bg-purple-500'
                    }`}
                    style={{
                      width: `${Math.min((task.currentAttempt / task.maxAttempts) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-gray-200 text-amber-600 rounded-lg shadow-sm">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Nota Mínima</p>
                <p className="font-bold text-slate-800 text-lg">{(task.minScoreToPass * 100).toFixed(0)}/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Historial de Intentos */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-slate-700">Historial de Intentos</h3>
        </div>

        {attemptsLoading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4">Cargando intentos...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay intentos registrados para esta tarea.</p>
            <p className="text-sm">Inicia la misión para ver tu progreso aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-3">Inicio</th>
                  <th className="px-6 py-3">Final</th>
                  <th className="px-6 py-3 text-center">Resultado</th>
                  <th className="px-6 py-3 text-center">Puntuación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attempts.map((attempt) => (
                  <tr 
                    key={attempt.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/metrics/${attempt.id}`, { 
                      state: { fromTaskDetail: true, taskPath: `/tasks/${taskId}` } 
                    })}
                  >
                    <td className="px-6 py-4 text-gray-700 group-hover:text-brand-primary transition-colors">
                      {new Date(attempt.startedAt).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                      {' '}
                      {new Date(attempt.startedAt).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-700 group-hover:text-brand-primary transition-colors">
                      {new Date(attempt.finishedAt).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                      {' '}
                      {new Date(attempt.finishedAt).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={clsx(
                        "px-2 py-1 rounded text-xs font-bold border",
                        attempt.status === 'APPROVED'
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : attempt.status === 'UNKNOWN'
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      )}>
                        {attempt.outcome === 'WIN' ? 'GANASTE' : attempt.outcome === 'LOSE' ? 'PERDISTE' : attempt.outcome}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-slate-700 group-hover:text-brand-primary transition-colors">
                        {(attempt.score * 100).toFixed(0)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
