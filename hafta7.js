/* ===================================================
   scripts/hafta7.js
   Mustafa Mert Ceylan | Web Programlama Dersi
   Etkileşimler:
     1) Tema değiştirme (dark / light)
     2) Kart detay modalı
     3) Form doğrulama + başvuru özeti
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* =============================================
       1) TEMA DEĞİŞTİRME
    ============================================= */
    const temaBtn  = document.getElementById('temaBtn');
    const temaIkon = document.getElementById('temaIkon');
    const temaYazi = document.getElementById('temaYazi');

    temaBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const karanlik = document.body.classList.contains('dark-mode');
        temaIkon.textContent = karanlik ? '☀️' : '🌙';
        temaYazi.textContent = karanlik ? ' Açık Tema' : ' Koyu Tema';
    });

    /* =============================================
       2) KART DETAY BUTONLARI
       Her karta tıklanınca o oturuma ait bilgi
       kartın altında toggle ile açılır/kapanır
    ============================================= */
    const kartBilgiler = {
        'pentest': {
            baslik: '🛡️ Penetrasyon Testi',
            detay: 'Konuşmacı: Dr. Ahmet Yıldız | Yer: Lab-A Salonu | Kota: 30 kişi\n' +
                   'Ön koşul: Temel Linux bilgisi önerilir. Kali Linux VM hazır getirilmeli.'
        },
        'network': {
            baslik: '🌐 Ağ Güvenliği',
            detay: 'Konuşmacı: Mühendis Selin Kara | Yer: Konferans Salonu | Kota: 50 kişi\n' +
                   'Ön koşul: TCP/IP temel bilgisi. Packet Tracer kurulu olmalı.'
        },
        'python': {
            baslik: '🐍 Python ile Otomasyon',
            detay: 'Konuşmacı: Araş. Gör. Emre Can | Yer: Bilgisayar Lab-2 | Kota: 25 kişi\n' +
                   'Ön koşul: Temel Python syntax bilgisi. Python 3.10+ kurulu olmalı.'
        }
    };

    document.querySelectorAll('.kart-detay-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const kartId   = btn.getAttribute('data-kart');
            const hedefId  = 'detay-' + kartId;
            const mevcut   = document.getElementById(hedefId);

            /* Zaten açıksa kapat */
            if (mevcut) {
                mevcut.remove();
                btn.textContent = 'Detay';
                return;
            }

            /* Diğer açık detayları kapat */
            document.querySelectorAll('.kart-detay-panel').forEach(function (p) {
                p.remove();
            });
            document.querySelectorAll('.kart-detay-btn').forEach(function (b) {
                b.textContent = 'Detay';
            });

            /* Yeni panel oluştur */
            const bilgi  = kartBilgiler[kartId];
            const panel  = document.createElement('div');
            panel.id     = hedefId;
            panel.className = 'kart-detay-panel';
            panel.innerHTML =
                '<strong>' + bilgi.baslik + '</strong><br>' +
                bilgi.detay.replace('\n', '<br>');

            btn.closest('.card-body').appendChild(panel);
            btn.textContent = 'Kapat ✕';
        });
    });

    /* =============================================
       3) BAŞVURU FORMU
    ============================================= */
    const form       = document.getElementById('basvuruForm');
    const sonucAlani = document.getElementById('sonucAlani');
    const uyariAlani = document.getElementById('uyariAlani');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const ad     = document.getElementById('adSoyad').value.trim();
        const email  = document.getElementById('email').value.trim();
        const bolum  = document.getElementById('bolum').value.trim();
        const oturum = document.getElementById('oturum').value;
        const mesaj  = document.getElementById('mesaj').value.trim();
        const kvkk   = document.getElementById('kvkk').checked;

        sonucAlani.style.display = 'none';
        uyariAlani.style.display = 'none';

        /* --- Doğrulama --- */
        const eksikler = [];
        if (!ad)     eksikler.push('Ad Soyad');
        if (!email)  eksikler.push('E-posta');
        if (!bolum)  eksikler.push('Bölüm');
        if (!oturum) eksikler.push('Oturum');
        if (!kvkk)   eksikler.push('KVKK onayı');

        if (eksikler.length > 0) {
            uyariAlani.innerHTML =
                '<div class="alert alert-warning" role="alert">' +
                '⚠️ Lütfen şu alanları doldurun: <strong>' +
                eksikler.join(', ') + '</strong></div>';
            uyariAlani.style.display = 'block';
            return;
        }

        /* E-posta format kontrolü */
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            uyariAlani.innerHTML =
                '<div class="alert alert-warning" role="alert">' +
                '⚠️ Geçerli bir e-posta adresi girin.</div>';
            uyariAlani.style.display = 'block';
            return;
        }

        /* --- Oturum etiketi --- */
        const oturumEl = document.getElementById('oturum');
        const oturumYazi = oturumEl.options[oturumEl.selectedIndex].text;

        /* --- Seçili seviye --- */
        const seviyeEl = document.querySelector('input[name="seviye"]:checked');
        const seviye   = seviyeEl ? seviyeEl.value : 'Belirtilmedi';

        /* --- Tarih / saat --- */
        const simdi  = new Date();
        const tarih  = simdi.toLocaleDateString('tr-TR');
        const saat   = simdi.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

        /* --- Özet kartı --- */
        sonucAlani.innerHTML =
            '<h5>✅ Başvurunuz Alındı!</h5>' +
            '<p><strong>Ad Soyad:</strong> '  + ad          + '</p>' +
            '<p><strong>E-posta:</strong> '   + email        + '</p>' +
            '<p><strong>Bölüm:</strong> '     + bolum        + '</p>' +
            '<p><strong>Oturum:</strong> '    + oturumYazi   + '</p>' +
            '<p><strong>Seviye:</strong> '    + seviye       + '</p>' +
            (mesaj ? '<p><strong>Not:</strong> ' + mesaj + '</p>' : '') +
            '<p><strong>Tarih:</strong> '     + tarih + ' ' + saat + '</p>';

        sonucAlani.style.display = 'block';
        sonucAlani.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
    });

});  /* DOMContentLoaded sonu */