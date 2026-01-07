import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import useGetPerformanceHistory from '@/hooks/useGetPerformanceHistory';
import useGetImprovementOverTime from '@/hooks/useGetImprovementOverTime';
import useGetSkillGrowth from '@/hooks/useGetSkillGrowth';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PerformanceHistory = () => {
    const { performanceHistory, loading: historyLoading } = useGetPerformanceHistory();
    const { trendData, improvement, totalAttempts, currentAverage, loading: improvementLoading } = useGetImprovementOverTime();
    const { skillGrowth, loading: skillsLoading } = useGetSkillGrowth();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatMonth = (monthKey) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (historyLoading || improvementLoading || skillsLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">Loading performance data...</div>
            </div>
        );
    }

    if (performanceHistory.length === 0 && trendData.length === 0 && skillGrowth.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Performance History</h2>
                    <p className="text-gray-600">No performance data available yet. Complete some quizzes to see your progress!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Performance History & Progress Tracking</h1>
                <p className="text-gray-600">Track your quiz performance, improvement over time, and skill growth</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Attempts</h3>
                    <p className="text-3xl font-bold text-blue-600">{totalAttempts}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Current Average</h3>
                    <p className="text-3xl font-bold text-green-600">{currentAverage}%</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Overall Improvement</h3>
                    <p className={`text-3xl font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {improvement >= 0 ? '+' : ''}{improvement}%
                    </p>
                </div>
            </div>

            {/* Improvement Over Time Chart */}
            {trendData.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200 w-full">
                    <h2 className="text-xl font-bold mb-4">Improvement Over Time</h2>
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="month" 
                                    tickFormatter={formatMonth}
                                />
                                <YAxis domain={[0, 100]} />
                                <Tooltip 
                                    formatter={(value) => `${value}%`}
                                    labelFormatter={(label) => formatMonth(label)}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="averageScore" 
                                    stroke="#3b82f6" 
                                    strokeWidth={2}
                                    name="Average Score (%)"
                                    dot={{ r: 4 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="passRate" 
                                    stroke="#10b981" 
                                    strokeWidth={2}
                                    name="Pass Rate (%)"
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Skill Growth Chart */}
            {skillGrowth.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200 w-full overflow-x-auto">
                    <h2 className="text-xl font-bold mb-4">Skill Growth by Category</h2>
                    <div className="w-full min-w-[600px]" style={{ minHeight: `${Math.max(300, skillGrowth.length * 60)}px` }}>
                        <ResponsiveContainer width="100%" height={Math.max(300, skillGrowth.length * 60)}>
                            <BarChart 
                                data={skillGrowth}
                                layout="vertical"
                                margin={{ top: 20, right: 50, left: 220, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    type="number"
                                    domain={[0, 100]}
                                    label={{ value: 'Accuracy (%)', position: 'insideBottom', offset: -5 }}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis 
                                    type="category"
                                    dataKey="category"
                                    width={200}
                                    tick={{ fontSize: 13, fill: '#374151', fontWeight: 500 }}
                                />
                                <Tooltip 
                                    formatter={(value) => `${value}%`}
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                />
                                <Legend />
                                <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy (%)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Past Simulation Attempts Table */}
            {performanceHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Past Simulation Attempts</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Job Title</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Company</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Score</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Result</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceHistory.map((attempt) => (
                                    <tr key={attempt.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">{formatDate(attempt.date)}</td>
                                        <td className="py-3 px-4 text-sm font-medium">{attempt.jobTitle}</td>
                                        <td className="py-3 px-4 text-sm">{attempt.companyName}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant="outline">{attempt.category}</Badge>
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold">
                                            <span className={attempt.score >= 80 ? 'text-green-600' : attempt.score >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                                                {attempt.score}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {attempt.passed ? (
                                                <div className="flex items-center text-green-600">
                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">Passed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-600">
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">Failed</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge 
                                                variant={
                                                    attempt.status === 'accepted' ? 'default' :
                                                    attempt.status === 'pending' ? 'secondary' : 'destructive'
                                                }
                                            >
                                                {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceHistory;

