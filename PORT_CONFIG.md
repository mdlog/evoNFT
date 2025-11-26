# Port Configuration

## Current Port: 3020

Aplikasi EvoNFT sekarang dikonfigurasi untuk selalu berjalan di port **3020**.

### Configuration

**File:** `evonft-app/vite.config.js`

```javascript
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3020,
        open: true,
        strictPort: true // Gagal jika port 3020 sudah digunakan
    }
})
```

### Options Explained

- `port: 3020` - Port yang akan digunakan
- `open: true` - Otomatis buka browser saat server start
- `strictPort: true` - Server akan gagal start jika port 3020 sudah digunakan (tidak akan mencoba port lain)

### Running the App

```bash
cd evonft-app
npm run dev
```

Server akan start di: **http://localhost:3020**

### Troubleshooting

#### Port 3020 Already in Use

Jika port 3020 sudah digunakan, Anda akan melihat error:

```
Error: Port 3020 is already in use
```

**Solusi:**

1. **Cari proses yang menggunakan port 3020:**
   ```bash
   # Linux/Mac
   lsof -i :3020
   
   # Atau
   netstat -tulpn | grep 3020
   ```

2. **Kill proses tersebut:**
   ```bash
   kill -9 <PID>
   ```

3. **Atau ubah port di vite.config.js** (jika Anda ingin menggunakan port lain)

#### Change Port Temporarily

Jika Anda ingin menggunakan port lain sementara tanpa mengubah config:

```bash
npm run dev -- --port 3030
```

### Port History

- **Before:** Port 3010
- **After:** Port 3020 (with strictPort enabled)

### Related Files

- `evonft-app/vite.config.js` - Server configuration
- `evonft-app/package.json` - Scripts configuration

---

**Note:** Setelah mengubah port, restart dev server untuk menerapkan perubahan.
