import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { studentService } from '../services/studentService';
import clsx from 'clsx';
import {useSession} from "../sessions/useSession.ts";
import type {AttemptServiceDTO} from "../models/dtos/AttemptServiceDTO.ts";
import { ProgressFilters } from '../components/ui/ProgressFilters';

export const ProgressPage = () => {
  const { student } = useSession();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados temporales para los filtros (lo que el usuario edita)
  const [outcomeFilter, setOutcomeFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Estados aplicados (se actualizan al pulsar Buscar)
  const [appliedOutcomeFilter, setAppliedOutcomeFilter] = useState('');
  const [appliedDateFromFilter, setAppliedDateFromFilter] = useState('');
  const [appliedDateToFilter, setAppliedDateToFilter] = useState('');

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      studentService.getStudentAttempts(student?.id)
        .then(attempts => {
          setAttempts(attempts);
        })
        .catch(err => {
          console.error('Error al obtener intentos:', err);
          setError('No se pudieron cargar los intentos.');
        })
        .finally(() => {
          setLoading(false);
        });
    };
    void run();
  }, [student?.id]);

  // Filtrar intentos
  const filteredAttempts = useMemo(() => {
    return attempts.filter(attempt => {
      // Filtro por resultado
      if (appliedOutcomeFilter && attempt.outcome !== appliedOutcomeFilter) {
        return false;
      }

      // Filtro por rango de fechas (fecha de inicio)
      if (appliedDateFromFilter || appliedDateToFilter) {
        const attemptDate = new Date(attempt.startedAt).toISOString().split('T')[0];
        
        if (appliedDateFromFilter && attemptDate < appliedDateFromFilter) {
          return false;
        }
        
        if (appliedDateToFilter && attemptDate > appliedDateToFilter) {
          return false;
        }
      }
      
      return true;
    });
  }, [attempts, appliedOutcomeFilter, appliedDateFromFilter, appliedDateToFilter]);

  const handleSearch = () => {
    setAppliedOutcomeFilter(outcomeFilter);
    setAppliedDateFromFilter(dateFromFilter);
    setAppliedDateToFilter(dateToFilter);
  };

  const handleClearFilters = () => {
    setOutcomeFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setAppliedOutcomeFilter('');
    setAppliedDateFromFilter('');
    setAppliedDateToFilter('');
  };

  // Cálculos para las tarjetas de resumen (usan intentos filtrados)
  const totalGames = filteredAttempts.length;
  const wins = filteredAttempts.filter(a => a.outcome === 'WIN').length;
  const avgScore = totalGames > 0
    ? (filteredAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalGames) * 100
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando historial...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <Breadcrumb items={[{ label: 'Progreso' }]} />
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          Mi Progreso
        </h1>
        <p className="text-gray-500">
          Historial de partidas y métricas de desempeño.
        </p>
      </div>

      {/* TARJETAS DE RESUMEN (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Partidas Jugadas</p>
            <p className="text-3xl font-bold text-slate-800">{totalGames}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Victorias</p>
            <p className="text-3xl font-bold text-slate-800">{wins}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Promedio Aceptación</p>
            <p className="text-3xl font-bold text-slate-800">{avgScore.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <ProgressFilters
          outcomeFilter={outcomeFilter}
          setOutcomeFilter={setOutcomeFilter}
          dateFromFilter={dateFromFilter}
          setDateFromFilter={setDateFromFilter}
          dateToFilter={dateToFilter}
          setDateToFilter={setDateToFilter}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
      />

      {/* TABLA DE HISTORIAL */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-slate-700">Historial de Intentos</h3>
        </div>

        {filteredAttempts.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            {attempts.length === 0 ? (
              <>
                <p>No tienes intentos registrados aún.</p>
                <p className="text-sm">Completa tu primera misión para ver tu progreso aquí.</p>
              </>
            ) : (
              <>
                <p>No se encontraron intentos con estos criterios.</p>
                {(appliedOutcomeFilter || appliedDateFromFilter || appliedDateToFilter) && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-brand-primary hover:underline text-sm font-bold"
                  >
                    Limpiar filtros
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-3">Tarea</th>
                  <th className="px-6 py-3">Inicio</th>
                  <th className="px-6 py-3">Final</th>
                  <th className="px-6 py-3 text-center">Resultado</th>
                  <th className="px-6 py-3 text-center">Puntuación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttempts.map((attempt) => (
                  <tr 
                    key={attempt.attemptId}
                    onClick={() => navigate(`/metrics/${attempt.attemptId}`, { state: { fromTaskDetail: false } })}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 group-hover:text-brand-primary transition-colors">
                      {attempt.taskId || `Tarea ${attempt.taskId.slice(0, 8)}...`}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
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
                    <td className="px-6 py-4 text-gray-700">
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
                      <div className="font-bold text-slate-700">
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