INSERT INTO skills.skill_ecosystem (id, "name")
VALUES (1, 'React'),
       (2, 'NodeJS');

INSERT INTO skills.skill_type (id, "name")
VALUES (1, 'Soft'),
       (2, 'Hard');

INSERT INTO skills.skill_role (id, "name")
VALUES (1, 'Frontend');

INSERT INTO skills.skill_catalog (id, "name", "type", ecosystem, "role", "description")
VALUES (1, 'React', 2, 1, 1, ''),
       (2, 'Next.js', 2, 1, 1, ''),
       (3, 'Redux', 2, 1, 1, ''),
       (4, 'Redux-Sagas', 2, 1, 1, ''),
       (5, 'Gatsby', 2, 1, 1, ''),
       (6, 'Express', 2, 2, 1, '');

INSERT INTO skills.skill_catalog_level (id, "level", "description", "skill_id")
VALUES (1, 1, 'I have a basic knowledge of the framework. Understand the framework principles and can implement solutions defined at the documentation or tutorials', 1),
       (2, 2, 'I can modify effectively already working solutions to include new features', 1),
       (3, 3, 'I can analyse working solutions and propose refactors and generalization', 1),
       (4, 4, 'I can define complex architectures and I can provide optimised solutions', 1),
       (5, 1, 'I understand the framework principles and I can implement solutions defined at the documentation or tutorials', 2),
       (6, 2, 'I modify effectively already working solutions to include new features', 2),
       (7, 3, 'I can analyse working solutions and I can propose refactors and generalisations', 2),
       (8, 4, 'I can define complex architectures and I can provide optimised solutions', 2),
       (9, 1, 'I have a basic knowledge of the library. I understand when use redux state and when use the component state.', 3),
       (10, 2, 'I can separate concepts and I have a proper usage of actions and reducers', 3),
       (11, 3, 'I am able to keep a normalised state, using complex reducers in order to guarantee immutability and flatten/efficient structures', 3),
       (12, 4, 'I can use the library in combination of others to build complex solutions.', 3),
       (13, 1, 'I can add new sagas into a working project', 4),
       (14, 2, 'I can configure from the scratch a new project', 4),
       (15, 3, 'I can write both sync and async sagas processes', 4),
       (16, 4, 'I can use Sagas to manage the state of all the components such ui (modals/toast) navigation (navigate between screens) and app state', 4);

INSERT INTO skills.user (user_id, email, "name", "role")
VALUES  ('asldkan21ansdkasnd', 'johndoe@guidesmiths.com', 'John Doe', 'user'),
        ('asldka12312sdkasnd', 'janedoe@guidesmiths.com', 'Jane Doe', 'user'),
        ('asldka12345sdkasnd', 'jennygo@guidesmiths.com', 'Jenny Goijman', 'user'),
        ('asldka12367sdkasnd', 'danicolas@guidesmiths.com', 'Daniel Colas', 'user'),
        ('asldka12389sdkasnd', 'dyusta@guidesmiths.com', 'David Yusta', 'user'),
        ('asldka12387sdkasnd', 'ssanchez@guidesmiths.com', 'Sofia Sanchez', 'user'),
        ('asldka12311sdkasnd', 'rachelFern@guidesmiths.com', 'Raquel Fernandez', 'user');

INSERT INTO skills.user_skill (skill_id, user_id, skill_value, interested, comments, skill_subvalue)
VALUES  (1, 'asldkan21ansdkasnd', 4, true, '', 'minus'),
        (4, 'asldkan21ansdkasnd', 3, true, '', 'plus'),
        (1, 'asldka12312sdkasnd', 3, true, '', 'neutral'),
        (2, 'asldkan21ansdkasnd', 2, false, '', 'neutral'),
        (2, 'asldka12311sdkasnd', 2, false, '', 'neutral'),
        (1, 'asldka12311sdkasnd', 4, false, '', 'plus'),
        (3, 'asldka12345sdkasnd', 3, false, '', 'neutral'),
        (4, 'asldka12345sdkasnd', 2, false, '', 'minus'),
        (1, 'asldka12345sdkasnd', 1, false, '', 'neutral'),
        (2, 'asldka12345sdkasnd', 1, false, '', 'neutral'),
        (2, 'asldka12389sdkasnd', 4, false, '', 'plus'),
        (3, 'asldka12389sdkasnd', 4, true, '', 'minus'),
        (4, 'asldka12367sdkasnd', 3, true, '', 'neutral'),
        (1, 'asldka12367sdkasnd', 2, true, '', 'neutral'),
        (2, 'asldka12367sdkasnd', 1, true, '', 'plus'),
        (4, 'asldka12387sdkasnd', 2, true, '', 'neutral'),
        (2, 'asldka12387sdkasnd', 3, true, '', 'minus'),
        (6, 'asldkan21ansdkasnd', 1, true, '', 'plus'),
        (6, 'asldka12312sdkasnd', 1, false, '', 'neutral');

INSERT INTO skills.user_suggestion (id, "description", "subject", user_id)
VALUES  (1, 'This is a suggestion related to the skill Next.js.', 'Skills', 'asldkan21ansdkasnd'),
        (2, 'This is an other suggestion related to the skill Next.js.', 'Skills', 'asldka12312sdkasnd'),
        (3, 'I would like to add "Chinese" as a new skill', 'Skills', 'asldka12345sdkasnd'),
        (4, 'This is a suggestion', 'Others', 'asldka12367sdkasnd');