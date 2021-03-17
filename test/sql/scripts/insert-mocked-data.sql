INSERT INTO skills.skill_ecosystem (id, "name")
VALUES (1, 'React');

INSERT INTO skills.skill_type (id, "name")
VALUES (1, 'Soft'),
       (2, 'Hard');

INSERT INTO skills.skill_role (id, "name")
VALUES (1, 'Frontend');

INSERT INTO skills.skill_catalog (id, "name", "type", ecosystem, "role", "description", levels)
VALUES (1, 'React', 2, 1, 1, '', '{
         "1": "I have a basic knowledge of the framework. Understand the framework principles and can implement solutions defined at the documentation or tutorials",
         "2": "I can modify effectively already working solutions to include new features",
         "3": "I can analyse working solutions and propose refactors and generalization",
         "4": "I can define complex architectures and I can provide optimised solutions"
       }'),
       (2, 'Next.js', 2, 1, 1, '', '{
         "1": "I understand the framework principles and I can implement solutions defined at the documentation or tutorials",
         "2": "I modify effectively already working solutions to include new features",
         "3": "I can analyse working solutions and I can propose refactors and generalisations",
         "4": "I can define complex architectures and I can provide optimised solutions"
       }'),
       (3, 'Redux', 2, 1, 1, '', '{
         "1": "I have a basic knowledge of the library. I understand when use redux state and when use the component state.",
         "2": "I can separate concepts and I have a proper usage of actions and reducers",
         "3": "I am able to keep a normalised state, using complex reducers in order to guarantee immutability and flatten/efficient structures",
         "4": "I can use the library in combination of others to build complex solutions."
       }'),
       (4, 'Redux-Sagas', 2, 1, 1, '', '{
         "1": "I can add new sagas into a working project",
         "2": "I can configure from the scratch a new project",
         "3": "I can write both sync and async sagas processes",
         "4": "I can use Sagas to manage the state of all the components such ui (modals/toast) navigation (navigate between screens) and app state"
       }');
