import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.config.settings import settings
from app.database.session import Base, engine
from app.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler
)
from app.middleware.logging import LoggingMiddleware
from app.routers import (
    auth_router,
    students_router,
    applications_router,
    documents_router,
    scholarship_router,
    admin_router,
    ml_router
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("app.main")

# Auto-create tables if running sqlite for rapid setup
Base.metadata.create_all(bind=engine)

# Ensure upload folders exist
for folder in ["income", "marksheets", "disability"]:
    os.makedirs(os.path.join(settings.UPLOAD_DIR, folder), exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Logging middleware
app.add_middleware(LoggingMiddleware)

# Custom Exception Handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include Routers under API_V1_STR
api_v1 = settings.API_V1_STR
app.include_router(auth_router, prefix=api_v1)
app.include_router(students_router, prefix=api_v1)
app.include_router(applications_router, prefix=api_v1)
app.include_router(documents_router, prefix=api_v1)
app.include_router(scholarship_router, prefix=api_v1)
app.include_router(admin_router, prefix=api_v1)
app.include_router(ml_router, prefix=api_v1)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
