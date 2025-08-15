import { Statistics } from '@/hooks/useStatistics';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
    statistics?: Statistics[];
};

const DurationBarChart: React.FC<Props> = ({ statistics }) => {
    if (!statistics) {
        return <></>;
    }
    const labels = statistics.map((stat) => dayjs(stat.date).date().toString());

    // Step 1: Build project data map
    const projectMap = new Map<
        number,
        { name: string; color: string; totalMinutes: number }
    >();

    statistics.forEach((stat) => {
        stat.projects.forEach((p) => {
            const existing = projectMap.get(p.project.id);
            const minutes = p.total_seconds / 60;
            if (existing) {
                existing.totalMinutes += minutes;
            } else {
                projectMap.set(p.project.id, {
                    name: p.project.title,
                    color: p.project.color,
                    totalMinutes: minutes,
                });
            }
        });
    });

    // Step 2: Create datasets
    const datasets = Array.from(projectMap.entries()).map(
        ([projectId, { name, color }]) => {
            const data = statistics.map((stat) => {
                const match = stat.projects.find((p) => p.project.id === projectId);
                return match ? match.total_seconds / 60 : 0;
            });

            return {
                label: name,
                projectId,
                data,
                backgroundColor: color,
                stack: 'stack1',
                borderRadius: 4,
            };
        },
    );

    const data = { labels, datasets };

    // Step 3: Customize legend
    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    generateLabels(chart) {
                        const datasets = chart.data.datasets;
                        return datasets.map((dataset: any, i) => {
                            const projectId = dataset.projectId;
                            const totalMinutes =
                                projectMap.get(projectId)?.totalMinutes ?? 0;
                            const label = `${dataset.label} (${Math.round(totalMinutes)}m)`;

                            return {
                                text: label,
                                fontColor: dataset.backgroundColor,
                                fillStyle: dataset.backgroundColor,
                                strokeStyle: dataset.backgroundColor,
                                lineWidth: 0,
                                hidden: !chart.isDatasetVisible(i),
                                datasetIndex: i,
                            };
                        });
                    },
                },
            },
        },
        scales: {
            x: { stacked: true },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    callback: (value) => `${value}m`,
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default DurationBarChart;
