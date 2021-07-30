SELECT us.id, us.description, us.subject, us.user_id as "userId", u."name" as "userName", us.created_on as "createdOn", us.updated_on as "updatedOn"
FROM skills.user_suggestion us
LEFT JOIN skills.user u on us.user_id = u.user_id
