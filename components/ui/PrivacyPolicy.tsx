'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:text-blue-700 underline"
      >
        Политика за поверителност
      </button>

      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <motion.div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <motion.div
          className="bg-white rounded-t-xl md:rounded-xl max-h-[90vh] overflow-y-auto w-full md:max-w-2xl"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Политика за поверителност</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-3xl leading-none text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-gray-600">
              <p>Последна актуализация: {new Date().toLocaleDateString('bg-BG')}</p>
              
              <h4>1. Въведение</h4>
              <p>
                Тази политика за поверителност описва как събираме, използваме и защитаваме Вашите лични данни в съответствие с
                Общия регламент за защита на личните данни (GDPR).
              </p>

              <h4>2. Какви данни събираме</h4>
              <p>За да участвате в анкетата, ние събираме следните данни:</p>
              <ul>
                <li>Име</li>
                <li>Град</li>
                <li>Имейл адрес</li>
                <li>Вашият глас (&quot;За&quot; или &quot;Против&quot;)</li>
                <li>Анонимизиран IP адрес за предотвратяване на дублирани гласове.</li>
              </ul>

              <h4>3. Как използваме Вашите данни</h4>
              <p>Данните се използват изключително за следните цели:</p>
              <ul>
                <li>Записване и преброяване на Вашия глас.</li>
                <li>Показване на обобщена статистика.</li>
                <li>Предотвратяване на злоупотреби и дублирани гласувания.</li>
              </ul>
              <p>Вашият имейл адрес не се показва публично и не се използва за маркетингови цели.</p>
              
              <h4>4. Защита на данните</h4>
              <p>
                Вашите данни се съхраняват сигурно. Ние не споделяме Вашите
                лични данни с трети страни.
              </p>

              <h4>5. Вашите права</h4>
              <p>Съгласно GDPR, Вие имате право да поискате достъп, корекция или изтриване на Вашите лични данни. За целта, моля свържете се с нас.</p>
              
              <h4>6. Контакт</h4>
              <p>За въпроси относно защитата на личните данни, моля свържете се с нас през официалната Facebook страница.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold transition-all hover:bg-blue-700 active:scale-95"
            >
              Затвори
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
