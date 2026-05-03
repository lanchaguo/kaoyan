'use strict'
// 刷题模块模型（含关联）
const Subject = require('./exam/Subject')
const QuestionType = require('./exam/QuestionType')
const Difficulty = require('./exam/Difficulty')
const KnowledgePoint = require('./exam/KnowledgePoint')
const Question = require('./exam/Question')
const QuestionOption = require('./exam/QuestionOption')
const QuestionKnowledge = require('./exam/QuestionKnowledge')
const Paper = require('./exam/Paper')
const PaperQuestion = require('./exam/PaperQuestion')
const Collection = require('./exam/Collection')
const UserAnswer = require('./exam/UserAnswer')
const WrongQuestion = require('./exam/WrongQuestion')
const PracticeProgress = require('./exam/PracticeProgress')

// Associations（均不创建外键约束，应用层关联）
Subject.hasMany(KnowledgePoint, { foreignKey: 'subject_id', as: 'knowledgePoints', constraints: false })
KnowledgePoint.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject', constraints: false })

Subject.hasMany(Question, { foreignKey: 'subject_id', as: 'questions', constraints: false })
Question.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject', constraints: false })

QuestionType.hasMany(Question, { foreignKey: 'type_id', as: 'questions', constraints: false })
Question.belongsTo(QuestionType, { foreignKey: 'type_id', as: 'type', constraints: false })

Difficulty.hasMany(Question, { foreignKey: 'difficulty_id', as: 'questions', constraints: false })
Question.belongsTo(Difficulty, { foreignKey: 'difficulty_id', as: 'difficulty', constraints: false })

Question.hasMany(QuestionOption, { foreignKey: 'question_id', as: 'options', constraints: false })
QuestionOption.belongsTo(Question, { foreignKey: 'question_id', constraints: false })

// 直接关联 QuestionKnowledge（用于题目详情返回 knowledge_id 列表）
Question.hasMany(QuestionKnowledge, { foreignKey: 'question_id', as: 'questionKnowledges', constraints: false })
QuestionKnowledge.belongsTo(Question, { foreignKey: 'question_id', constraints: false })

Question.belongsToMany(KnowledgePoint, {
  through: QuestionKnowledge, foreignKey: 'question_id', otherKey: 'knowledge_id', as: 'knowledgePoints',
  constraints: false
})

Paper.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject', constraints: false })
Paper.hasMany(PaperQuestion, { foreignKey: 'paper_id', as: 'paperQuestions', constraints: false })
PaperQuestion.belongsTo(Paper, { foreignKey: 'paper_id', constraints: false })
PaperQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question', constraints: false })

Collection.belongsTo(Question, { foreignKey: 'question_id', as: 'question', constraints: false })
Question.hasMany(Collection, { foreignKey: 'question_id', constraints: false })

UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question', constraints: false })
Question.hasMany(UserAnswer, { foreignKey: 'question_id', constraints: false })

WrongQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question', constraints: false })
Question.hasMany(WrongQuestion, { foreignKey: 'question_id', constraints: false })

PracticeProgress.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject', constraints: false })

module.exports = {
  Subject, QuestionType, Difficulty, KnowledgePoint,
  Question, QuestionOption, QuestionKnowledge,
  Paper, PaperQuestion,
  Collection, UserAnswer, WrongQuestion, PracticeProgress
}

