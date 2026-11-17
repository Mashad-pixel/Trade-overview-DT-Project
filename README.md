Trade Analysis

Project Category: Design Thinking Project (DT Project)
Domain: Financial Technology | Trading Analytics | Risk Assessment
Technology Stack: React, TypeScript, Vite, Python, FastAPI, SQLite

---

1. Project Overview

Trade Analysis is a financial technology platform developed as a Design Thinking Project. It is designed to help users analyze trading performance, evaluate financial risks, simulate hypothetical market conditions, and understand the potential impact of market fluctuations.

The platform combines a React-based frontend with a Python backend to process financial data, perform quantitative calculations, simulate market scenarios, and present analytical results through interactive visualizations.

It provides multiple analytical components, including scenario analysis, financial contagion simulation, reverse stress testing, trading statistics, and trading journal management.

The primary objective is to provide users with a structured environment for understanding trading performance, identifying potential vulnerabilities, and evaluating different financial scenarios.

2. Key Features

2.1 Trade Analysis

- Analyze trading activity and financial performance.
- Evaluate trading statistics and historical records.
- Examine potential risks associated with market movements.
- Provide structured analytical results.

2.2 Scenario Analysis

- Simulate hypothetical market conditions.
- Apply financial shocks to portfolio scenarios.
- Analyze the potential impact of changing market variables.
- Generate structured scenario analysis results.

2.3 Financial Contagion Simulation

- Model relationships between connected financial entities.
- Simulate the propagation of financial shocks.
- Examine secondary effects and interconnected risks.
- Visualize potential contagion scenarios.

2.4 Reverse Stress Testing

- Evaluate conditions that could lead to adverse financial outcomes.
- Explore combinations of hypothetical market shocks.
- Identify scenarios that could result in significant losses.
- Examine potential vulnerabilities under extreme conditions.

2.5 Trading Journal

- Record and manage trading activity.
- Maintain historical trade records.
- Review trading performance.
- Generate rule-based analytical reviews.
- Store journal information using SQLite.

2.6 Trading Statistics

- Calculate trading performance metrics.
- Analyze historical trading records.
- Generate statistical summaries.
- Evaluate trading consistency and performance.

2.7 Data Visualization

- Correlation heatmaps.
- Scenario shock controls.
- Historical versus hypothetical projection charts.
- Interactive financial analysis views.
- Trading performance visualizations.

3. Technology Stack

Component| Technologies
Frontend| React, TypeScript
Build Tool| Vite
Backend| Python, FastAPI
Database| SQLite
Data Formats| JSON, CSV
API Architecture| REST
Testing| Pytest
Development Tools| Git, GitHub, VS Code

4. System Architecture

The platform follows a frontend-backend architecture. The frontend handles user interaction and data presentation, while the backend processes API requests, performs quantitative calculations, and manages application data.

                    USER
                      |
                      v
               REACT FRONTEND
               TypeScript + Vite
                      |
                      v
                 FASTAPI
                  BACKEND
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
      QUANTITATIVE  CONTAGION   SCENARIO
       ENGINE       ENGINE     ANALYSIS
          |           |           |
          +-----------+-----------+
                      |
                      v
               ANALYSIS RESULTS
                      |
              +-------+-------+
              |               |
              v               v
         VISUALIZATION     DATA STORAGE
              |               |
              v               v
           USER VIEW         SQLITE

Main Components

Frontend Layer

- React-based user interface.
- TypeScript application logic.
- Interactive analytical widgets.
- API communication and state management.

Backend Layer

- FastAPI application.
- Quantitative analysis engine.
- Scenario processing.
- Financial contagion simulation.
- Reverse stress testing.
- Trading journal operations.

Data Layer

- JSON-based demonstration portfolio data.
- Historical CSV and JSON datasets.
- SQLite-based trading journal storage.
- Temporary in-memory analysis storage.

5. Project Structure

trade-analysis/
│
├── backend/
│   ├── engine/
│   │   ├── __init__.py
│   │   ├── quant.py
│   │   ├── ai_agent.py
│   │   └── contagion.py
│   │
│   ├── journal/
│   ├── trading_user_stats/
│   ├── main.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── pages/
│   │   ├── components/
│   │   │   └── widgets/
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── .env.example
│
├── mock-data/
│   └── portfolios.json
│
├── historical_dataset/
│
├── tradefxbook/
│
├── tests/
│
├── docs/
│
├── run_tradefxbook.py
├── requirement.txt
├── CONTRACT.md
├── .gitignore
└── README.md

6. API Documentation

The primary backend exposes REST API endpoints for trading analysis and financial risk simulation.

Method| Endpoint| Description
GET| "/health"| Backend health check
GET| "/api/portfolios"| Retrieve demonstration portfolios
POST| "/api/analyze-scenario"| Execute scenario analysis
GET| "/api/contagion/scenarios"| Retrieve available contagion scenarios
POST| "/api/contagion/simulate"| Execute financial contagion simulation
POST| "/api/reverse-stress-test"| Perform reverse stress testing
GET| "/butterfly"| Access the associated application endpoint

API Documentation Interface

FastAPI provides interactive API documentation.

- Swagger UI: "http://127.0.0.1:8000/docs"
- OpenAPI Schema: "http://127.0.0.1:8000/openapi.json"

7. Getting Started

Prerequisites

Install the following software before running the project:

- Python 3.10 or later
- Node.js
- npm
- Git

Step 1: Clone the Repository

git clone YOUR_REPOSITORY_URL
cd trade-analysis

Step 2: Set Up the Backend

Create a Python virtual environment:

python -m venv .venv

Activate it on Windows using PowerShell:

.\.venv\Scripts\Activate.ps1

On Linux or macOS:

source .venv/bin/activate

Install backend dependencies:

python -m pip install -r backend/requirements.txt

Start the backend server:

python -m uvicorn backend.main:app --reload --port 8000

Backend URL:

"http://127.0.0.1:8000"

API documentation:

"http://127.0.0.1:8000/docs"

Step 3: Set Up the Frontend

Open another terminal:

cd frontend
npm install

Create a ".env.local" file using ".env.example" as a reference.

Configure the backend URL:

VITE_API_BASE_URL=http://localhost:8000

Start the frontend development server:

npm run dev

Vite will display the local frontend URL in the terminal.

8. Additional Components

8.1 Trading Journal

The trading journal provides functionality for recording, managing, and reviewing trading activity.

Key components:

- Trade record management.
- Journal analytics.
- Rule-based trade reviews.
- SQLite-based data storage.

Default database location:

backend/journal/trading_journal.sqlite3

The database location can be configured using:

TRADING_JOURNAL_DB_PATH

8.2 Trading Statistics

The trading statistics application provides additional analytical functionality.

It operates as a separate API service and uses its own SQLite database.

Install its development dependencies:

python -m pip install -r backend/trading_user_stats/requirements-dev.txt

Start the service:

python -m uvicorn trading_user_stats.app.api:app --app-dir backend --reload --port 8001

Local service:

"http://127.0.0.1:8001/"

API documentation:

"http://127.0.0.1:8001/docs"

The application can generate synthetic demonstration trading records for testing and analysis.

8.3 TradeFXBook

TradeFXBook is an additional application included in the project structure.

Install its dependencies:

python -m pip install -r requirement.txt

Start the application:

python run_tradefxbook.py --port 8080

Local URL:

"http://127.0.0.1:8080"

API documentation:

"http://127.0.0.1:8080/docs"

9. Data Management

The platform works with multiple types of financial and application data.

Data Source| Purpose
"portfolios.json"| Demonstration portfolio information
Historical datasets| Historical market data analysis
CSV files| Structured financial datasets
JSON files| Portfolio and application data
SQLite| Trading journal persistence
Synthetic trade records| Demonstration and testing

Data Storage

- Trading journal records are stored in SQLite.
- Demonstration portfolios are maintained in JSON files.
- Historical datasets are maintained in CSV and JSON formats.
- Some analysis results are stored temporarily in application memory.
- In-memory analysis results may be lost when the backend restarts.

10. Configuration

The application supports environment-based configuration.

Environment Variable| Purpose
"CORS_ORIGINS"| Configures allowed frontend origins
"LOG_LEVEL"| Configures backend logging
"VITE_API_BASE_URL"| Specifies the backend API address
"TRADING_JOURNAL_DB_PATH"| Specifies the trading journal database location

Environment-specific configuration should be maintained locally. Sensitive values should not be committed to the repository.

11. Testing and Validation

Backend Testing

Run the backend test suite:

pytest tests/

Frontend Validation

Run linting:

npm run lint

Run the production build:

npm run build

These commands provide checks for backend functionality, frontend code quality, and production build compatibility.

12. Current Scope and Limitations

The current platform is an analytical prototype. Its implemented functionality should be distinguished from potential future improvements.

- Demonstration portfolio data is used for sample analysis.
- Some frontend data and calculations are illustrative.
- Scenario interpretation currently uses deterministic, rule-based logic rather than a verified external LLM or trained prediction model.
- Analysis results stored in process memory are not persistent.
- Production-grade authentication and multi-user security have not been established across all components.
- Live brokerage execution is not part of the platform.
- Historical data availability and quality depend on the underlying data source.
- Production deployment, monitoring, and load testing are not established.

13. Future Development

Potential improvements include:

- Integration of additional verified financial data sources.
- Advanced trading performance analytics.
- Improved portfolio optimization techniques.
- More advanced risk prediction and forecasting models.
- Expanded stress-testing methodologies.
- Persistent storage for saved analysis results.
- Stronger authentication and access control.
- Improved frontend-backend integration.
- Automated testing and deployment pipelines.
- Comprehensive financial reporting and export functionality.

14. Security and Privacy Considerations

- Application configuration should be managed through environment variables.
- Development credentials and default secrets should be replaced before deployment.
- API access should be protected before exposing the application to untrusted users.
- Database access and user separation require additional production-level controls.
- Financial datasets should be handled with appropriate attribution and data-use permissions.

15. Disclaimer

Trade Analysis is a financial analysis and decision-support prototype intended for research, educational, and analytical purposes.

The platform does not provide personalized investment, financial, or tax advice. Simulated scenarios and historical results do not guarantee future market performance.

Users should independently evaluate financial decisions and verify the accuracy of relevant data before relying on analytical results.

---

Trade Analysis | Design Thinking Project (DT Project)