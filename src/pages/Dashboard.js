import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Bar, Pie } from 'react-chartjs-2';
import { differenceInMinutes, parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function Dashboard() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    api.get('/chamados')
      .then(res => setChamados(res.data))
      .catch(err => console.error("Erro ao carregar chamados:", err));
  }, []);

  // Gráfico de Barras - Chamados por Status
  const statusCounts = chamados.reduce((acc, chamado) => {
    acc[chamado.status] = (acc[chamado.status] || 0) + 1;
    return acc;
  }, {});

  const statusBarData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Chamados por Status',
        data: Object.values(statusCounts),
        backgroundColor: 'rgba(72, 133, 172, 0.83)',
      },
    ],
  };

  // Gráfico de Pizza - Chamados por Criticidade
  const criticidadeCounts = chamados.reduce((acc, chamado) => {
    acc[chamado.criticidade] = (acc[chamado.criticidade] || 0) + 1;
    return acc;
  }, {});

  const criticidadePieData = {
    labels: Object.keys(criticidadeCounts),
    datasets: [
      {
        label: 'Chamados por Criticidade',
        data: Object.values(criticidadeCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };
    // 🔸 Atendente com mais chamados
  const chamadosPorAtendente = chamados.reduce((acc, c) => {
    const id = c.atendenteId || 'Sem atendente';
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const atendenteComMaisChamados = Object.entries(chamadosPorAtendente).sort((a, b) => b[1] - a[1])[0];

  // 🔹 Tempo médio de resolução (em minutos)
  const temposResolvidos = chamados
    .filter(c => c.status === 'RESOLVIDO' && c.dataHoraFinalizacao)
    .map(c => {
      const inicio = parseISO(c.dataHoraCriacao);
      const fim = parseISO(c.dataHoraFinalizacao);
      return differenceInMinutes(fim, inicio);
    });

  const mediaResolucao = temposResolvidos.length > 0
    ? (temposResolvidos.reduce((a, b) => a + b, 0) / temposResolvidos.length).toFixed(1)
    : 'N/A';

  

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">🧑‍💼 Atendente com mais chamados:<br /> <strong>{atendenteComMaisChamados?.[0]}</strong> ({atendenteComMaisChamados?.[1]})</div>
        <div className="card">⏱️ Tempo médio de resolução:<br /> <strong>{mediaResolucao} min</strong></div>
      </div>
      
<div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>

  <div style={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
    <Pie data={criticidadePieData} />
  </div>
    <div style={{ flex: 1, minWidth: 300, maxWidth: 600 }}>
    <Bar data={statusBarData} />
  </div>
</div>


    </div>
    
  );
}

export default Dashboard;
