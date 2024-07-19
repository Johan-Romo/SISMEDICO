from flask import Flask, render_template, request, redirect, url_for
import requests
from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'ingenieroespe'

API_BASE_URL = 'http://localhost:3000/api'  # Asegúrate de que esta URL coincida con tu backend

@app.route('/')
def index():
    return redirect(url_for('pacientes'))

@app.route('/pacientes', methods=['GET', 'POST'])
def pacientes():
    if request.method == 'POST':
        # Lógica para crear un nuevo paciente en la base de datos a través del backend
        data = {
            'nombre': request.form['nombre'],
            'apellido': request.form['apellido'],
            'fecha_nacimiento': request.form['fecha_nacimiento'],
            'email': request.form['email']
        }
        requests.post(f'{API_BASE_URL}/pacientes', json=data)
        return redirect(url_for('pacientes'))

    # Obtener lista de pacientes desde el backend
    response = requests.get(f'{API_BASE_URL}/pacientes')
    pacientes = response.json()
    return render_template('pacientes.html', pacientes=pacientes)

@app.route('/medicos', methods=['GET', 'POST'])
def medicos():
    if request.method == 'POST':
        # Lógica para crear un nuevo médico en la base de datos a través del backend
        data = {
            'nombre': request.form['nombre'],
            'apellido': request.form['apellido'],
            'especialidad': request.form['especialidad']
        }
        requests.post(f'{API_BASE_URL}/medicos', json=data)
        return redirect(url_for('medicos'))

    # Obtener lista de médicos desde el backend
    response = requests.get(f'{API_BASE_URL}/medicos')
    medicos = response.json()
    return render_template('medicos.html', medicos=medicos)

@app.route('/consultorios', methods=['GET', 'POST'])
def consultorios():
    if request.method == 'POST':
        # Lógica para crear un nuevo consultorio en la base de datos a través del backend
        data = {
            'numero': request.form['numero'],
            'piso': request.form['piso']
        }
        requests.post(f'{API_BASE_URL}/consultorios', json=data)
        return redirect(url_for('consultorios'))

    # Obtener lista de consultorios desde el backend
    response = requests.get(f'{API_BASE_URL}/consultorios')
    consultorios = response.json()
    return render_template('consultorios.html', consultorios=consultorios)


@app.route('/eliminar_cita/<int:id>', methods=['POST'])
def eliminar_cita(id):
    # Eliminar la cita en el backend
    response = requests.delete(f'{API_BASE_URL}/citas/{id}')
    if response.status_code == 200:
        flash('Cita eliminada correctamente', 'success')
    else:
        flash('Error al eliminar la cita', 'error')
    return redirect(url_for('citas'))

@app.route('/citas', methods=['GET', 'POST'])
def citas():
    if request.method == 'POST':
        # Lógica para crear una nueva cita en la base de datos a través del backend
        data = {
            'paciente_id': request.form['paciente_id'],
            'medico_id': request.form['medico_id'],
            'fecha': request.form['fecha'],
            'hora': request.form['hora'],
            'consultorio': request.form['consultorio']
        }
        requests.post(f'{API_BASE_URL}/citas', json=data)
        return redirect(url_for('citas'))

    # Obtener lista de citas desde el backend
    response = requests.get(f'{API_BASE_URL}/citas')
    citas = response.json()

    # Asegurarse de que cada cita tenga un 'id'
    for cita in citas:
        if 'id' not in cita:
            # Si el backend no proporciona un 'id', generamos uno temporal
            # Nota: Esto es solo una solución temporal, lo ideal es que el backend proporcione los IDs
            cita['id'] = hash(frozenset(cita.items()))  # Genera un ID basado en el contenido de la cita

    # Obtener lista de pacientes desde el backend
    response_pacientes = requests.get(f'{API_BASE_URL}/pacientes')
    pacientes = response_pacientes.json()

    # Obtener lista de médicos desde el backend
    response_medicos = requests.get(f'{API_BASE_URL}/medicos')
    medicos = response_medicos.json()

    # Obtener lista de consultorios desde el backend
    response_consultorios = requests.get(f'{API_BASE_URL}/consultorios')
    consultorios = response_consultorios.json()

    return render_template('citas.html', citas=citas, pacientes=pacientes, medicos=medicos, consultorios=consultorios)

@app.route('/editar_citas', methods=['GET', 'POST'])
def editar_citas():
    # Obtener lista de citas desde el backend
    response = requests.get(f'{API_BASE_URL}/citas')
    citas = response.json()

    if request.method == 'POST':
        # Lógica para actualizar la cita seleccionada
        cita_id = request.form['cita_id']
        data = {
            'paciente_id': request.form['paciente_id'],
            'medico_id': request.form['medico_id'],
            'fecha': request.form['fecha'],
            'hora': request.form['hora'],
            'consultorio': request.form['consultorio']
        }
        response = requests.put(f'{API_BASE_URL}/citas/{cita_id}', json=data)
        if response.status_code == 200:
            flash('Cita actualizada correctamente', 'success')
        else:
            flash('Error al actualizar la cita', 'error')
        return redirect(url_for('editar_citas'))

    # Obtener listas de pacientes, médicos y consultorios
    pacientes = requests.get(f'{API_BASE_URL}/pacientes').json()
    medicos = requests.get(f'{API_BASE_URL}/medicos').json()
    consultorios = requests.get(f'{API_BASE_URL}/consultorios').json()

    return render_template('editar_citas.html', citas=citas, pacientes=pacientes, medicos=medicos, consultorios=consultorios)

if __name__ == '__main__':
    app.run(debug=True)
