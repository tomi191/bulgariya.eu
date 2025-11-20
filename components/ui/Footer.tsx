'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <div>
            <p>&copy; {currentYear} Национален референдум. Всички права запазени.</p>
          </div>

          <div className="flex gap-4">
            <a href="#" className="hover:text-black transition">Политика за поверителност</a>
            <span>•</span>
            <a href="https://www.facebook.com/BYLGARI" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Контакт</a>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 text-center mt-4">
          Това е неофициална анкета за събиране на общественото мнение. Не е официален референдум и не е регистрирана при държавни органи.
        </p>

        <p className="text-[10px] text-gray-500 text-center mt-3">
          За упражняване на правата си по GDPR (доступ, корекция, изтриване на данни), моля свържете се чрез Facebook страницата.
        </p>
      </div>
    </footer>
  )
}
