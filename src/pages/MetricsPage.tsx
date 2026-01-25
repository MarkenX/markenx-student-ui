import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { TrendingUp, DollarSign, Clock, Target, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { attemptService } from '../services/attemptService';
import type { MetricServiceDTO } from '../models/dtos/MetricServiceDTO';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import manHappyImg from '../assets/man-happy.png';
import manDisappointedImg from '../assets/man-dissapointed.png';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export const MetricsPage = () => {
  const { attemptId } = useParams();
  const location = useLocation();

  const [metrics, setMetrics] = useState<MetricServiceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!attemptId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await attemptService.getAttemptMetrics(attemptId);
        setMetrics(data);
      } catch (err) {
        console.error('Error cargando métricas:', err);
        setError('No se pudieron cargar las métricas del intento.');
      } finally {
        setLoading(false);
      }
    };

    void loadMetrics();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="ml-2 text-gray-600">Cargando métricas...</span>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-600">{error || 'Métricas no encontradas'}</span>
      </div>
    );
  }

  // Determinar breadcrumb basado en el origen
  const breadcrumbItems = location.state?.fromTaskDetail
    ? [
        { label: 'Tareas', path: '/tasks' },
        { label: 'Detalles', path: location.state.taskPath },
        { label: 'Desempeño' }
      ]
    : [
        { label: 'Progreso', path: '/progress' },
        { label: 'Desempeño' }
      ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Cabecera */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          Tu Desempeño
        </h1>
        <p className="text-gray-500">
          Fecha: {metrics.sessionDate && format(new Date(metrics.sessionDate), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
        </p>
      </div>

      {/* Layout Principal: Métricas + Imagen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Métricas - Izquierda */}
        <div className="lg:col-span-8">
          {/* Tarjeta contenedora de todas las métricas */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 space-y-4">
            
            {/* Resultado de la Simulación - Compacto */}
            <div className={`p-3 rounded-xl border-2 ${
              metrics.finalOutcome === 'WIN' 
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  metrics.finalOutcome === 'WIN' ? 'bg-emerald-200' : 'bg-red-200'
                }`}>
                  <Trophy size={24} className={
                    metrics.finalOutcome === 'WIN' ? 'text-emerald-700' : 'text-red-700'
                  } />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-600 uppercase mb-1">Resultado de la Simulación</h3>
                  <p className={`text-lg font-black ${
                    metrics.finalOutcome === 'WIN' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {metrics.finalOutcome === 'WIN' 
                      ? '¡Felicitaciones! Completaste la misión exitosamente' 
                      : 'No alcanzaste el objetivo mínimo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Grid de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Descubrimiento de Perfil */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Target size={28} />
            </div>
            <span className={`text-3xl font-black ${
              metrics.profileDiscoveryPercentage >= 0.7 ? 'text-emerald-600' : 
              metrics.profileDiscoveryPercentage >= 0.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {(metrics.profileDiscoveryPercentage * 100).toFixed(0)}%
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Descubrimiento de Perfil</h3>
          <p className="text-xs text-gray-400">Porcentaje del perfil del consumidor descubierto</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                metrics.profileDiscoveryPercentage >= 0.7 ? 'bg-emerald-500' : 
                metrics.profileDiscoveryPercentage >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.profileDiscoveryPercentage * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Aceptación Final */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <TrendingUp size={28} />
            </div>
            <span className={`text-3xl font-black ${
              metrics.finalAcceptance >= 0.7 ? 'text-emerald-600' : 
              metrics.finalAcceptance >= 0.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {(metrics.finalAcceptance * 100).toFixed(0)}%
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Aceptación Final</h3>
          <p className="text-xs text-gray-400">Nivel de aceptación del producto por el consumidor</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                metrics.finalAcceptance >= 0.7 ? 'bg-emerald-500' : 
                metrics.finalAcceptance >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.finalAcceptance * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Presupuesto Restante */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <DollarSign size={28} />
            </div>
            <span className="text-3xl font-black text-purple-600">
              ${metrics.remainingBudget.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Presupuesto Restante</h3>
          <p className="text-xs text-gray-400">Dinero que quedó al finalizar la simulación</p>
        </div>

        {/* Turnos Utilizados */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Clock size={28} />
            </div>
            <span className="text-3xl font-black text-orange-600">
              {metrics.totalTurnsUsed}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Turnos Utilizados</h3>
          <p className="text-xs text-gray-400">Total de acciones realizadas durante la simulación</p>
        </div>

          </div>
          
          </div>
        </div>

        {/* Imagen del Resultado - Derecha */}
        <div className="lg:col-span-4 flex items-end justify-center">
          <div className="w-full max-w-xs">
            <img 
              src={metrics.finalOutcome === 'WIN' ? manHappyImg : manDisappointedImg}
              alt={metrics.finalOutcome === 'WIN' ? 'Éxito' : 'Intenta de nuevo'}
              className="w-full h-auto max-h-[25rem] object-contain drop-shadow-lg"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
