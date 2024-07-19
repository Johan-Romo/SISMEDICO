import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import date, time

# Configuración de la base de datos
DATABASE_URL = "postgresql://Johan:ingenieroespe@localhost/sismedico"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = SessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

def test_crear_paciente(db_session):
    query = text("""
        INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento, email)
        VALUES (:nombre, :apellido, :fecha_nacimiento, :email)
        RETURNING id
    """)
    result = db_session.execute(query, {
        "nombre": "Juanse",
        "apellido": "Pérez",
        "fecha_nacimiento": date(1990, 1, 1),
        "email": "juan.perez@example.com"
    })
    paciente_id = result.scalar()
    
    assert paciente_id is not None

def test_crear_medico(db_session):
    query = text("""
        INSERT INTO Medicos (nombre, apellido, especialidad)
        VALUES (:nombre, :apellido, :especialidad)
        RETURNING id
    """)
    result = db_session.execute(query, {
        "nombre": "Mahría",
        "apellido": "Gonsález",
        "especialidad": "Cardiología"
    })
    medico_id = result.scalar()
    
    assert medico_id is not None

def test_crear_cita(db_session):
    # Primero, creamos un paciente y un médico
    paciente_query = text("INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento, email) VALUES (:nombre, :apellido, :fecha_nacimiento, :email) RETURNING id")
    medico_query = text("INSERT INTO Medicos (nombre, apellido, especialidad) VALUES (:nombre, :apellido, :especialidad) RETURNING id")
    
    paciente_id = db_session.execute(paciente_query, {
        "nombre": "Anita",
        "apellido": "López",
        "fecha_nacimiento": date(1985, 5, 15),
        "email": "ana.lopez@example.com"
    }).scalar()
    
    medico_id = db_session.execute(medico_query, {
        "nombre": "Carlitos",
        "apellido": "Rodríguez",
        "especialidad": "Pediatría"
    }).scalar()
    
    # Ahora creamos la cita
    cita_query = text("""
        INSERT INTO Citas (paciente_id, medico_id, fecha, hora, consultorio)
        VALUES (:paciente_id, :medico_id, :fecha, :hora, :consultorio)
        RETURNING id
    """)
    result = db_session.execute(cita_query, {
        "paciente_id": paciente_id,
        "medico_id": medico_id,
        "fecha": date(2024, 7, 20),
        "hora": time(14, 30),
        "consultorio": "A101"
    })
    cita_id = result.scalar()
    
    assert cita_id is not None

def test_verificar_relaciones(db_session):
    # Creamos datos de prueba
    paciente_query = text("INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento, email) VALUES (:nombre, :apellido, :fecha_nacimiento, :email) RETURNING id")
    medico_query = text("INSERT INTO Medicos (nombre, apellido, especialidad) VALUES (:nombre, :apellido, :especialidad) RETURNING id")
    cita_query = text("INSERT INTO Citas (paciente_id, medico_id, fecha, hora, consultorio) VALUES (:paciente_id, :medico_id, :fecha, :hora, :consultorio) RETURNING id")
    
    paciente_id = db_session.execute(paciente_query, {
        "nombre": "Laura",
        "apellido": "Martínez",
        "fecha_nacimiento": date(1992, 8, 10),
        "email": "laura.martinez@example.com"
    }).scalar()
    
    medico_id = db_session.execute(medico_query, {
        "nombre": "Roberto",
        "apellido": "Sánchez",
        "especialidad": "Dermatología"
    }).scalar()
    
    cita_id = db_session.execute(cita_query, {
        "paciente_id": paciente_id,
        "medico_id": medico_id,
        "fecha": date(2024, 7, 25),
        "hora": time(10, 0),
        "consultorio": "B202"
    }).scalar()
    
    # Verificamos las relaciones
    verificacion_query = text("""
        SELECT p.nombre AS paciente_nombre, m.nombre AS medico_nombre, c.fecha, c.hora
        FROM Citas c
        JOIN Pacientes p ON c.paciente_id = p.id
        JOIN Medicos m ON c.medico_id = m.id
        WHERE c.id = :cita_id
    """)
    result = db_session.execute(verificacion_query, {"cita_id": cita_id}).fetchone()
    
    assert result is not None
    assert result.paciente_nombre == "Laura"
    assert result.medico_nombre == "Roberto"
    assert result.fecha == date(2024, 7, 25)
    assert result.hora == time(10, 0)