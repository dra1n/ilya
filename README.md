# Ilya the Game

### Platform

Will consist of several parts. Game engile for running all game logic. It takes
user and some initial information. Then it keeps and manages game state
associated with this user. Admin engine handles all changes to the game, levels, stories,
actions, etc. This allows to create different interfaces to admin
panel so people are able to generate game content through the web or from a telegram bot.
In the future this will allow to handle authorization if we have to
(probabli not).

### Actions

The simplest action takes user to the next screen.

More complex one changes game state. Inside the action descisions are made based on the
current game state, so we need to provide one. We are not chaning the
state in place, rather action returns a changed part and the next level.
This allows recursion as the level can be the current one.
As the state changes it provides a mechaninsm to exit the recursion.

The critical part in action handling is a feedback as it can be edited
in very restricted environment, like telegram chat. So action is able to
transform any state, easy to test and fast to report about any error.

Action has guards `if` and `unless` which allow to deside should this
action be displayed. They are the functions with provided state, this
should be enough info to make a descision. Maybe later we would add aliases like
`unlessVisited` for the most popular checks.

### Screen

The simplest screen is a story. It could take some variations too. Just
plain text, text interpolated with values from some part of the game
state, and a function with access to game state which contains some game
logic and returns text part.

### Title

Just in case. It's nice to have one.


## Game map

Here is a sketch of a possible game sript.

```
const actionTypes = {
  NEXT_LEVEL: '@NEXT_LEVEL'
}

const levels = {
  intro: {
    title: 'Проклятие',
    story: `В народе из уст в уста передавали такую историю. Будто бы дед Ильи Муромца был язычником и, не признавая христианство, однажды разрубил икону. С тех пор проклятие пало на его род — все мальчики будут рождаться калеками.

Через 10 лет родился Илья, и казалось, проклятие исполнилось: мальчик с детства не мог ходить. Все попытки вылечить его не увенчались успехом. Но Илья не сдавался, упорно тренировал руки, развивал мышцы, становясь все более сильным, но, увы, ходить по-прежнему не мог. Шли годы, и, наверное, не раз ему казалось, что нужно смириться с судьбой: он навсегда останется калекой.

Но когда Илье исполнилось 33 года, произошло нечто необъяснимое. Настал день, который круто и навсегда изменил его жизнь. В дом вошли вещие старцы — калики перехожие (нищие странники), и попросили мальчика подать воды. Он объяснил, что не может ходить. Но гости настойчиво повторили просьбу, которая прозвучала уже как приказ. И Илья, внезапно почувствовав небывалую силу, впервые встал на ноги…`,
    actions: [
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'healing'
        description: 'Встать с кровати'
      }
    ]
  },


  healing: {
    title: 'Чудесное исцеление'
    story: `Что это? Чудесное исцеление? Возможно. Но как странные гости сумели исцелить, казалось бы, безнадежно больного? На этот счет существуют разные предположения. Например, что странники были волхвами и магами и знали секреты древних заговоров.

А другие ученые предпогагают, что это был случай самоисцеления, объяснить который наука пока не в состоянии…

Как бы то ни было, Илья встал на ноги после 33 лет неподвижности. И ученые, проводившие исследования мощей, подтверждают, что костная ткань этого человека чудесным образом восстановилась. Более того, по их заключению, после тридцати лет он вел активный образ жизни, что полностью соответствует былинам.`,
    actions: [
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'nightingale the robber'
        description: 'Мочить Соловья-разбойника'
      },
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'other knights'
        description: 'Подружиться с богатырями'
      },
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'monk'
        description: 'Постричься в монахи'
      },
    ]
  },


  'nightingale the robber': {
    title: 'Соловей-разбойник',
    story: `После чудесного исцеления Илья Муромец, как и положено богатырям и героям, совершает многочисленные подвиги. Самый известный его подвиг — победа над Соловьем-разбойником.

Исследователи считают, что Соловей-разбойник — не сказочное чудище, а тоже реальная историческая личность, разбойник, промышлявший в лесах по дороге к Киеву. А Соловьем этого разбойника прозвали за то, что он извещал о своем нападении свистом (или, возможно, давал свистом сигнал своей банде к нападению).В дальнейшем Илья Муромец совершил множество других подвигов, участвовал в сражениях, защищая от врагов землю русскую. Современники отмечали его невероятную, нечеловеческую силу, поэтому в памяти людей он остался, наверное, самым великим русским богатырем. Достаточно вспомнить картину «Три богатыря», на который Илья Муромец изображен в центре — как самый сильный и могучий.`,
    actions: [
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'other knights'
        description: 'Подружиться с богатырями',
        unless(state) {
          return state.visitedLocations.includes('other knights')
        }
      },
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'monk'
        description: 'Постричься в монахи',
        unless(state) {
          return state.visitedLocations.includes('monk')
        }
      }
    ]
  },


  'other knights': {
    title: 'Три богатыря',
    story: `В былинах и легендах три богатыря — Илья Муромец, Алеша Попович и Добрыня Никитич — часто вместе совершают подвиги. Но на самом деле они никогда не встречались. Их разделяли века — Добрыня Никитич жил в 10 веке, Алеша Попович — в 13 веке, а Илья — в 12-м веке. Но когда легенды столетиями передаются от одного поколения к другому, они обрастают новыми подробностями, знаменитые персонажи начинают совершать новые подвиги, а временные рамки постепенно размываются и смещаются. Вопреки легендам, Илья Муромец никогда не служил князю Владимиру Великому. Они просто не могли встретиться, потому что жили в разные века. Илья служил князю Святославу, защищая Русь от половцев.`,
    actions: [
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'nightingale the robber',
        description: 'Таки замочить Соловья-разбойника',
        unless(state) {
          return state.visitedLocations.includes('nightingale the robber')
        }
      },
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'monk',
        description: 'Уйти в монастырь',
        unless(state) {
          return state.visitedLocations.includes('monk')
        }
      }
    ]
  },


  'monk': {
    title: 'Печерская Лавра',
    story: `В германских эпических поэмах, записанных в ХIII веке, но основанных на более ранних сказаниях, упоминается великий богатырь Илья Русский. Легенда говорит о том, что в одном в жестоком сражении Илья чуть не погиб, но чудом остался жив и дал обет удалиться в монастырь, посвятить себя Богу и больше никогда не брать в руки меч. Илья пришел к стенам Лавры, снял с себя все воинские доспехи, но не смог бросить меч и взял его с собой. Он стал монахом Печерской Лавры и все свои дни проводил в своей келье в молитвах.`,
    actions: [
      {
        type: actionTypes.NEXT_LEVEL,
        link: 'the end'
      }
    ]
  },


  'the end': {
    title: 'Монахи Лавры',
    story: `Но однажды враги подступили к стенам монастыря, и Илья своими глазами увидел гибель настоятеля Лавры, сраженного смертельным ударом. И тогда Илья, несмотря на обет, снова взял в руки меч. Но почувствовал, что ноги снова отказываются ему служить. Он еще успел заслониться рукой от смертельного удара копьем, но силы уже покидали его…

Так ли это было на самом деле? Вряд ли мы когда-нибудь это узнаем. Но несомненно одно: ученые установили, что Илья действительно погиб в результате удара копьем в грудь и что он, видимо, пытался остановить копье на лету, и это немного ослабило удар. Но полученная рана так и не зажила и в конце концов стала причиной гибели Муромца.`
  }
}
```
