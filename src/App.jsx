// src/App.jsx
import { useEffect, useState } from 'react';
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';

const contoh = [
  {
    id: '1',
    title: 'Seminar AI Kampus',
    date: '2026-11-12',
    location: 'Fasilkom-TI',
  },
  {
    id: '2',
    title: 'Workshop React',
    date: '2026-11-20',
    location: 'Lab Komputer',
  },
];

// Komponen Daftar Event
function DaftarEvent({ events, onAdd, onDelete }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !date || !location.trim()) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      location: location.trim(),
    });

    setTitle('');
    setDate('');
    setLocation('');
    setError('');
  }

  // --- LOGIKA PENGURUTAN TANGGAL BARU ---
  // Kita buat salinan array events dengan [...events] agar tidak merusak state asli,
  // lalu kita urutkan berdasarkan konversi tanggalnya (yang tercepat/terkecil di depan).
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <section>
      <h2>Daftar Acara Kampus ({events.length})</h2>

      <div className="form-container">
          <form onSubmit={handleSubmit} className="add-form">
            <input
              aria-label="Nama acara"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama Acara"
            />
            <input
              aria-label="Tanggal acara"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              aria-label="Lokasi acara"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lokasi"
            />
            <button type="submit" className="btn-primary">Tambah</button>
          </form>
          {error && <p className="error-msg" role="alert">{error}</p>}
      </div>

      {events.length === 0 && <p className="empty-state">Belum ada acara.</p>}

      <div className="event-grid">
        {/* Ubah events.map menjadi sortedEvents.map di bawah ini */}
        {sortedEvents.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <div className="event-details">
                <p>📅 {event.date}</p>
                <p>📍 {event.location}</p>
            </div>
            <div className="card-actions">
                <Link to={`/event/${event.id}`} className="btn-outline">Detail</Link>
                <Link to={`/edit/${event.id}`} className="btn-outline edit-btn">Edit</Link>
                <button onClick={() => onDelete(event.id)} className="btn-danger">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Komponen Detail Event
function DetailEvent({ events }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <div className="page-container">
          <p>Acara tidak ditemukan. <Link to="/">Kembali</Link></p>
      </div>
    );
  }

  return (
    <section className="page-container detail-page">
      <h2>{event.title}</h2>
      <div className="detail-info">
          <p><strong>Tanggal:</strong> {event.date}</p>
          <p><strong>Lokasi:</strong> {event.location}</p>
      </div>
      <button className="btn-primary" onClick={() => navigate('/')}>
        Kembali ke daftar
      </button>
    </section>
  );
}

// Komponen Edit Event (BARU)
function EditEvent({ events, onEdit }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const eventToEdit = events.find((item) => item.id === id);
    
    // Inisialisasi state dengan data event lama jika ada
    const [title, setTitle] = useState(eventToEdit ? eventToEdit.title : '');
    const [date, setDate] = useState(eventToEdit ? eventToEdit.date : '');
    const [location, setLocation] = useState(eventToEdit ? eventToEdit.location : '');
    const [error, setError] = useState('');

    if (!eventToEdit) {
        return <div className="page-container"><p>Acara tidak ditemukan. <Link to="/">Kembali</Link></p></div>;
    }

    function handleEditSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !date || !location.trim()) {
            setError('Semua kolom wajib diisi.');
            return;
        }

        onEdit(id, {
            title: title.trim(),
            date,
            location: location.trim(),
        });
        navigate('/'); // Kembali ke beranda setelah edit
    }

    return (
        <section className="page-container edit-page">
            <h2>Edit Acara</h2>
            <form onSubmit={handleEditSubmit} className="edit-form">
                 <div className="input-group">
                    <label>Nama Acara</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                 </div>
                 <div className="input-group">
                    <label>Tanggal</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                 </div>
                 <div className="input-group">
                    <label>Lokasi</label>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                 </div>
                
                {error && <p className="error-msg">{error}</p>}
                
                <div className="edit-actions">
                    <button type="submit" className="btn-primary">Simpan Perubahan</button>
                    <button type="button" className="btn-outline" onClick={() => navigate('/')}>Batal</button>
                </div>
            </form>
        </section>
    );
}

// Komponen Tentang
function Tentang() {
  return (
    <section className="page-container">
      <h2>Tentang Mading Kampus</h2>
      <p>Sistem informasi digital berbasis Single Page Application (SPA) untuk manajemen acara kemahasiswaan. Dibangun menggunakan React Hooks & Routing.</p>
    </section>
  );
}

// Komponen Not Found
function NotFound() {
  return (
    <div className="page-container">
        <h2>404</h2>
        <p>Halaman tidak ditemukan. <Link to="/">Kembali ke Beranda</Link></p>
    </div>
  );
}

// Komponen Utama App
export default function App() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('event-kampus-v1')
      );

      return Array.isArray(saved) ? saved : contoh;
    } catch {
      return contoh;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'event-kampus-v1',
      JSON.stringify(events)
    );
  }, [events]);

  function addEvent(event) {
    setEvents((prev) => [...prev, event]);
  }

  function deleteEvent(id) {
    setEvents((prev) =>
      prev.filter((event) => event.id !== id)
    );
  }

  // Fungsi Edit Event
  function editEvent(id, updatedData) {
      setEvents((prev) => 
          prev.map((event) => 
              event.id === id ? { ...event, ...updatedData } : event
          )
      );
  }

  return (
      <main className="app-layout">
        <header className="main-header">
          <div className="header-content">
              <h1>📌 Mading Kampus</h1>
              <nav className="main-nav">
                <Link to="/">Beranda</Link>
                <Link to="/tentang">Tentang</Link>
              </nav>
          </div>
        </header>

        <div className="main-content">
            <Routes>
            <Route
                path="/"
                element={
                <DaftarEvent
                    events={events}
                    onAdd={addEvent}
                    onDelete={deleteEvent}
                />
                }
            />
            <Route
                path="/event/:id"
                element={<DetailEvent events={events} />}
            />
             <Route
                path="/edit/:id"
                element={<EditEvent events={events} onEdit={editEvent} />}
            />
            <Route
                path="/tentang"
                element={<Tentang />}
            />
            <Route
                path="*"
                element={<NotFound />}
            />
            </Routes>
        </div>
      </main>
  );
}