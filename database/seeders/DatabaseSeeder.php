<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User dummy (Pak Kiki sebagai owner & Pak Tirta sebagai karyawan)
        // sudah di-INSERT langsung via migration setup_nutrilog_schema.
        //
        // Seeder ini sengaja dikosongkan agar tidak ada konflik.
        // Tambahkan seeder lain di sini kalau perlu data tambahan.
    }
}
