**Илюшниковва Анастасия, 146 группа**

**Проект: Имиджборд**

---
Система анонимных форумов с возможностью прикреплять к сообщениям изображения (аналоги: iichan.hk). Сервис состоит из набора разделов (досок), в которых пользователи могут начать обсуждение (тред) и писать комментарии в существующих тредах. Экран доски отображает список тредов и последние N комментариев, треды отсортированы по дате обновления. Пользователь идентифицируется по IP и cookie, но для неадминистратора не должно быть возможности ассоциировать сообщения с одним пользователем. Администратор должен иметь возможность создавать/удалять доски, редактировать и удалять сообщениях, также должна быть возможность удалить разом все сообщения определенного пользователя и запретить ему писать новые.

**Требования**.

- В приложении можно создавать треды и комментарии.
- Можно прикреплять к сообщениям изображения.
- Приложение защищено от инъекций к базе, XSS-атак.
- Находясь на странице треда, можно подгрузить новые ответы, если они есть без перезагрузки страницы.
- Реализованы все функции, доступные администратору (см. описание)
- В реальном времени отображается количество просматривающих доску или тред
- Сервис готов к запуску (по чеклисту выполнено все или почти все)

