---
title: 'Deep Planning & Architecture'
description: 'WAJIB digunakan sebelum menulis kode fitur baru atau refactor besar.'
triggers:
  - 'buat fitur'
  - 'tambah halaman'
  - 'refactor'
  - 'rencanakan'
---

# Deep Planning Protocol

Stop! Jangan menyentuh file `.tsx` atau `.ts` dulu.
Kita harus merancang solusi di dalam file `PLAN.md` (buat di root jika belum ada).

## Langkah Kerja:

1.  **Analisis Component Hierarchy:**

    - Komponen apa yang perlu dibuat?
    - Di mana lokasinya? (`components/ui` atau `components/dashboard`?)
    - Apakah perlu update `tailwind.config`?

2.  **Data Structure Design (TypeScript):**

    - Tuliskan `interface` atau `type` yang akan digunakan.
    - Contoh:
      ```typescript
      interface Expense {
      	id: string;
      	amount: number;
      	category: 'food' | 'transport' | 'etc';
      	date: Date;
      }
      ```

3.  **Step-by-Step Implementation:**

    - Break down menjadi langkah kecil (misal: 1. Buat Type, 2. Buat Komponen Dummy, 3. Styling, 4. Logic).

4.  **Konfirmasi:**
    - Tampilkan rencana ini ke user. Minta persetujuan "Lanjut?".
