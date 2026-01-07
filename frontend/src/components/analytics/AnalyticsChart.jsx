import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AnalyticsChart = ({ jobsApplied, activeApplicants, activeRecruiters, userRole }) => {
    // Data for bar chart - different data based on user role
    const barChartData = userRole === 'applicant' 
        ? [
            {
                name: 'Your Jobs Applied',
                value: jobsApplied
            },
            {
                name: 'Active Applicants',
                value: activeApplicants
            },
            {
                name: 'Active Recruiters',
                value: activeRecruiters
            }
        ]
        : [
            {
                name: 'Active Applicants',
                value: activeApplicants
            },
            {
                name: 'Active Recruiters',
                value: activeRecruiters
            }
        ];

    // Data for pie chart (users breakdown)
    const pieChartData = [
        { name: 'Applicants', value: activeApplicants },
        { name: 'Recruiters', value: activeRecruiters }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4">
                    {userRole === 'applicant' ? 'Your Applications & Platform Stats' : 'Platform Statistics'}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Active Users Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;

