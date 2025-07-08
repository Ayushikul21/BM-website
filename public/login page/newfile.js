
      const url = 'https://api.etimeoffice.com/api/DownloadInOutPunchData?Empcode=10119&FromDate=07/07/2025&ToDate=07/07/2025';

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': 'BANDYMOOT001:OMDUBEY:Rudra@123:true'
          }
        });
        const data = await response.json();

        if (!data || data.Error || !data.InOutPunchData) {
          showNotification('No attendance data found.', 'error');
          return;
        }

        const attendance = data.InOutPunchData;

        console.log("attendance ::: ", attendance)

        const tbody = document.getElementById('attendanceHistory');
        tbody.innerHTML = '';

        attendance.forEach(record => {
          const status = getReadableStatus(record.Status);
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${record.DateString || '--'}</td>
            <td>${record.INTime || '--'}</td>
            <td>${record.OUTTime || '--'}</td>
            <td>${record.WorkTime || '00:00'}</td>
            <td><span class="status-badge ${getStatusBadgeClass(status)}">${status}</span></td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error('Error fetching attendance:', err);
        showNotification('Failed to fetch attendance data.', 'error');
      }