<?php require 'views/static/header.php' ?>
<form class="ajax-form form" action="register" method="POST" novalidate>
    <h3>Kayıt Formu</h3>
    <div class="info"></div>
    <ul>
        <li>
            <label>E-posta</label>
            <input type="email" name="email" required maxlength="255" />
        </li>
        <li>
            <label>Şifre</label>
            <small class="regex-info" data-rules="register-password">
                <ul>
                    <li data-rules-rule="^.{8,32}$">En az 8 en fazla 32 karakter içermelidir.</li>
                    <li data-rules-rule="[A-Z]">En az 1 büyük harf içermelidir.</li>
                    <li data-rules-rule="[a-z]">En az 1 küçük harf içermelidir.</li>
                    <li data-rules-rule="\d">En az 1 sayı içermelidir.</li>
                </ul>
            </small>
            <input data-regex="register-password" type="password" name="password" required pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,32}$" />
        </li>
        <li>
            <button type="submit">Üye Ol</button>
        </li>
    </ul>
</form>
<?php require 'views/static/footer.php' ?>
