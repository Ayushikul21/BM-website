const TaskTemplate = ({tasks,name,email}) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Task Assignment Email</title>
<style>
    * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        
        .email-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: red;
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
       
        
        
        .tasks-section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 22px;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        
        .task-card {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease;
        }
        
        .task-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .assignee-name {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .task-details {
            margin-bottom: 15px;
        }
        
        .task-row {
            display: flex;
            margin-bottom: 8px;
            align-items: flex-start;
        }
        
        .task-label {
            font-weight: bold;
            color: #555;
            min-width: 100px;
            margin-right: 15px;
        }
        
        .task-content {
            color: #333;
            flex: 1;
            
        }
        
        .signature {
            background-color: #f5f5f5;
            padding: 25px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
        }
        
        .signature-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .signature-title {
            color: #666;
            margin-bottom: 10px;
        }
        
        .contact-info {
            font-size: 14px;
            color: #888;
        }
        
        
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .content, .header {
                padding: 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .task-row {
                flex-direction: column;
            }
            
            .task-label {
                min-width: auto;
                margin-bottom: 5px;
            }
        }
</style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>📋 Task Assignment</h1>
            <p>Project Management & Task Distribution</p>
        </div>
        
        <!-- Main Content -->
        <div class="tasks-section">
            <h2 class="section-title">👥 Individual Task Assignments</h2>

            ${tasks.map(task => `
                <div class="task-card">
                    <div class="assignee-name">👤 ${task.name}</div>
                    <div class="task-details">
                        <div class="task-row">
                            <span class="task-label">Task:</span>
                            <span class="task-content">${task.description}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <p style="text-align: center; color: #666; margin-top: 20px;">
            Thank you for your cooperation and dedication to this project!
        </p>

        <!-- Signature -->
        <div class="signature">
            <div class="signature-name">${name}</div>
            <div class="signature-title">Data Analyst</div>
            <div class="contact-info">
                📧 ${email}
            </div>
        </div>
    </div>
</body>
</html>
    `
}

module.exports = TaskTemplate;