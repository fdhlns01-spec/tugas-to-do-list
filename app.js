// ===== 1. Seleksi elemen DOM =====
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const warningMessage = document.getElementById('warningMessage');
const emptyMessage = document.getElementById('emptyMessage');

const statTotal = document.getElementById('statTotal');
const statDone = document.getElementById('statDone');
const statPending = document.getElementById('statPending');

// ===== 2. Fungsi bantu =====

// Menampilkan pesan peringatan di bawah form
function showWarning(message) {
    warningMessage.textContent = message;
    warningMessage.hidden = false;
}

// Menyembunyikan pesan peringatan
function hideWarning() {
    warningMessage.hidden = true;
}

// Menghitung ulang statistik dan pesan kosong (dipanggil setiap ada perubahan)
function updateStats() {
    const total = taskList.children.length;
    const done = taskList.querySelectorAll('.completed').length;

    statTotal.textContent = total;
    statDone.textContent = done;
    statPending.textContent = total - done;

    emptyMessage.hidden = total > 0;
}

// Membuat satu elemen tugas (li) dari teks yang diketik
function createTaskItem(text) {
    const item = document.createElement('li');
    item.className = 'task-item';

    // Label berisi checkbox + teks, sehingga klik di teks juga menandai selesai
    const label = document.createElement('label');
    label.className = 'task-item__label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const taskText = document.createElement('span');
    taskText.className = 'task-item__text';
    taskText.textContent = text; // textContent aman dari HTML injection

    label.append(checkbox, taskText);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Hapus';

    item.append(label, deleteButton);
    return item;
}

// ===== 3. Event: tambah tugas (tombol "Tambah" atau tekan Enter) =====
taskForm.addEventListener('submit', function (event) {
    event.preventDefault(); // cegah halaman reload

    const taskText = taskInput.value.trim();

    // Validasi input kosong
    if (taskText === '') {
        showWarning('Tugas tidak boleh kosong. Ketik dulu tugasmu.');
        taskInput.focus();
        return;
    }

    hideWarning();
    taskList.append(createTaskItem(taskText));
    taskInput.value = '';
    taskInput.focus();
    updateStats();
});

// Peringatan hilang saat pengguna mulai mengetik
taskInput.addEventListener('input', hideWarning);

// ===== 4. Event: tandai selesai & hapus (event delegation pada <ul>) =====
taskList.addEventListener('change', function (event) {
    if (event.target.type === 'checkbox') {
        const item = event.target.closest('.task-item');
        item.classList.toggle('completed', event.target.checked);
        updateStats();
    }
});

taskList.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
        event.target.closest('.task-item').remove(); // hapus dengan remove()
        updateStats();
    }
});

// ===== 5. Tampilan awal =====
updateStats();