//управление состоянием кнопки во время отправки данных на сервер
export function loadingButton(submitButton, promise) {
  const originalText = submitButton.textContent //сохраняем исходный текст кнопки
  submitButton.textContent = 'Сохранение...' //меняем исходный текст на индикатор загрузки
  submitButton.disabled = true //блокируем кнопку

    return Promise.resolve(promise)
      .then(result => {
      //ставляем кнопку заблокированной
      submitButton.textContent = originalText;
      return result;
    })
    .catch(error => {
      //разблокируем при ошибке
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      throw error;
    });
}