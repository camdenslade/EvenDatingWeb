//********************************************************************
//
// UsersPerHourGraph Component
//
// Displays a bar chart showing users per hour over the last 12 hours.
// Ready to be wired to backend endpoint when available.
//
//*******************************************************************

import { useEffect, useState } from 'react';
import './UsersPerHourGraph.css';

interface HourlyData {
  hour: string; // e.g., "2 PM", "3 PM"
  count: number;
}

interface UsersPerHourGraphProps {
  data?: HourlyData[];
}

export default function UsersPerHourGraph({ data }: UsersPerHourGraphProps) {
  const [chartData, setChartData] = useState<HourlyData[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      // Generate placeholder data for last 12 hours
      const now = new Date();
      const placeholder: HourlyData[] = [];
      for (let i = 11; i >= 0; i--) {
        const hour = new Date(now);
        hour.setHours(hour.getHours() - i);
        const hourLabel = hour.toLocaleTimeString('en-US', { 
          hour: 'numeric',
          hour12: true 
        });
        placeholder.push({
          hour: hourLabel,
          count: 0, // Will be populated by backend
        });
      }
      setChartData(placeholder);
    }
  }, [data]);

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="admin-users-per-hour-graph">
      <div className="admin-graph-header">
        <h3>Users Per Hour (Last 12 Hours)</h3>
        {(!data || data.length === 0) && (
          <span className="admin-graph-placeholder">
            Waiting for backend endpoint
          </span>
        )}
      </div>
      <div className="admin-graph-container">
        <div className="admin-graph-bars">
          {chartData.map((item, index) => (
            <div key={index} className="admin-graph-bar-wrapper">
              <div className="admin-graph-bar-container">
                <div
                  className="admin-graph-bar"
                  style={{
                    height: `${(item.count / maxCount) * 100}%`,
                  }}
                  title={`${item.hour}: ${item.count} users`}
                />
              </div>
              <div className="admin-graph-label">{item.hour}</div>
            </div>
          ))}
        </div>
        <div className="admin-graph-y-axis">
          <div className="admin-graph-y-label">{maxCount}</div>
          <div className="admin-graph-y-label">{Math.floor(maxCount / 2)}</div>
          <div className="admin-graph-y-label">0</div>
        </div>
      </div>
    </div>
  );
}

