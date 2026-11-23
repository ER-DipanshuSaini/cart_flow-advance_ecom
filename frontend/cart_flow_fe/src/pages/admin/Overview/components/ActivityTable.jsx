import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './ActivityTable.css';

const TRYON_ACTIVITIES = [
  {
    srNo: 1,
    processId: 'TRY-0067',
    product: 'Black Cable Knit Crop Sweater – Mock Neck',
    status: 'Quota exceeded',
    userId: 'USR-0441',
    tokens: 0,
    created: '11/24/2026, 12:13:39 AM',
  },
  {
    srNo: 2,
    processId: 'TRY-0066',
    product: 'Sky Blue Cable Knit Crop Sweater – Crew Neck',
    status: 'Completed',
    userId: 'USR-0441',
    tokens: '3,151',
    created: '11/24/2026, 12:11:53 AM',
  },
  {
    srNo: 3,
    processId: 'TRY-0065',
    product: "Men's Sky Blue & White Micro-Check Shirt",
    status: 'Quota exceeded',
    userId: 'USR-0212',
    tokens: 0,
    created: '11/18/2026, 10:18:41 PM',
  },
  {
    srNo: 4,
    processId: 'TRY-0064',
    product: "Men's Sky Blue & White Micro-Check Shirt",
    status: 'Completed',
    userId: 'USR-0212',
    tokens: '3,150',
    created: '11/18/2026, 10:15:19 PM',
  },
  {
    srNo: 5,
    processId: 'TRY-0063',
    product: 'Forest Green Oversized Zip-Up Hoodie',
    status: 'Completed',
    userId: 'USR-0176',
    tokens: '3,150',
    created: '11/17/2026, 10:43:54 AM',
  },
];

export default function ActivityTable() {
  return (
    <div className="cf-table-container">
      <div className="cf-table-header-row">
        <h3 className="cf-table-title">Latest try-on activity</h3>
        <a href="#processes" className="cf-table-link">
          All processes <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="cf-table-responsive-wrapper">
        <table className="cf-activity-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Sr. No.</th>
              <th style={{ width: '130px' }}>Process ID</th>
              <th>Product</th>
              <th style={{ width: '170px' }}>Status</th>
              <th style={{ width: '120px' }}>User ID</th>
              <th style={{ width: '100px' }}>Tokens</th>
              <th style={{ width: '200px' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {TRYON_ACTIVITIES.map((row) => (
              <tr key={row.processId}>
                <td className="cf-col-sr">{row.srNo}</td>
                <td className="cf-col-id">{row.processId}</td>
                <td className="cf-col-product">{row.product}</td>
                <td className="cf-col-status">
                  <span
                    className={`cf-status-pill ${
                      row.status === 'Completed' ? 'is-completed' : 'is-quota'
                    }`}
                  >
                    <span className="cf-status-bullet">•</span>
                    <span>{row.status}</span>
                  </span>
                </td>
                <td className="cf-col-user">{row.userId}</td>
                <td className="cf-col-tokens">{row.tokens}</td>
                <td className="cf-col-date">{row.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
