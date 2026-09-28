import './App.css'
import { useEffect, useState } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: ''
  })

  const loadStudents = async () => {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data)
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    setForm({
      studentId: '',
      name: '',
      email: ''
    })

    loadStudents()
  }

const handleEdit = async (student) => {
  const newName = window.prompt('Nhập họ tên mới:', student.name)
  if (!newName) return

  const newEmail = window.prompt('Nhập email mới:', student.email)
  if (!newEmail) return

  await fetch(`/api/students/${student._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      studentId: student.studentId,
      name: newName,
      email: newEmail
    })
  })

  loadStudents()
}

const handleDelete = async (student) => {
  const confirmDelete = window.confirm(
    `Bạn có chắc muốn xóa ${student.name} không?`
  )

  if (!confirmDelete) return

  await fetch(`/api/students/${student._id}`, {
    method: 'DELETE'
  })

  loadStudents()
}

 return (
  <div className="container">
      <h1>Quản lý sinh viên</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="MSSV"
          value={form.studentId}
          onChange={(e) =>
            setForm({ ...form, studentId: e.target.value })
          }
          required
        />

        <input
          placeholder="Họ tên"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <button type="submit">Thêm sinh viên</button>
      </form>

      <h2>Danh sách sinh viên</h2>

      <ul>
  {students.map((student) => (
    <li key={student._id}>
      <span>
        {student.studentId} - {student.name} - {student.email}
      </span>

      <div className="action-buttons">
        <button
          type="button"
          onClick={() => handleEdit(student)}
        >
          Sửa
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => handleDelete(student)}
        >
          Xóa
        </button>
      </div>
    </li>
  ))}
</ul>
    </div>
  )
}

export default App