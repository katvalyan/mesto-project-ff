//управление состоянием кнопки во время отправки данных на сервер
export function loadingButton(submitButton, promise) {
  const originalText = submitButton.textContent //сохраняем исходный текст кнопки
  submitButton.textContent = 'Сохранение...' //меняем исходный текст на индикатор загрузки
  submitButton.disabled = true //блокируем кнопку
  return Promise.resolve(promise).finally(() => {
      submitButton.textContent = originalText //возвращаем исходный текст кнопки
      submitButton.disabled = false //разблокируем кнопку
  })
}