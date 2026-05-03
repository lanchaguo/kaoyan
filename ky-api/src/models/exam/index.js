'use strict'

// 使用 require() 直接引入模型（sequelize.import 在 v6 已废弃）
const Subject = require('./Subject')
const QuestionType = require('./QuestionType')
const Difficulty = require('./Difficulty')
const KnowledgePoint = require('./KnowledgePoint')
const Question = require('./Question')
const QuestionOption = require('./QuestionOption')
const QuestionKnowledge = require('./QuestionKnowledge')
const Paper = require('./Paper')
const PaperQuestion = require('./PaperQuestion')
const Collection = require('./Collection')
const UserAnswer = require('./UserAnswer')
const WrongQuestion = require('./WrongQuestion')
const PracticeProgress = require('./PracticeProgress')

// Associations
Subject.hasMany(KnowledgePoint, { foreignKey: 'subject_id', as: 'knowledgePoints' })
KnowledgePoint.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' })

Subject.hasMany(Question, { foreignKey: 'subject_id', as: 'questions' })
Question.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' })

QuestionType.hasMany(Question, { foreignKey: 'type_id', as: 'questions' })
Question.belongsTo(QuestionType, { foreignKey: 'type_id', as: 'type' })

Difficulty.hasMany(Question, { foreignKey: 'difficulty_id', as: 'questions' })
Question.belongsTo(Difficulty, { foreignKey: 'difficulty_id', as: 'difficulty' })

Question.hasMany(QuestionOption, { foreignKey: 'question_id', as: 'options' })
QuestionOption.belongsTo(Question, { foreignKey: 'question_id' })

// 直接关联 QuestionKnowledge（用于题目详情返回 knowledge_id 列表）
Question.hasMany(QuestionKnowledge, { foreignKey: 'question_id', as: 'questionKnowledges' })
QuestionKnowledge.belongsTo(Question, { foreignKey: 'question_id' })

Question.belongsToMany(KnowledgePoint, {
  through: QuestionKnowledge, foreignKey: 'question_id', otherKey: 'knowledge_id', as: 'knowledgePoints'
})
KnowledgePoint.belongsToMany(Question, {
  through: QuestionKnowledge, foreignKey: 'knowledge_id', otherKey: 'question_id', as: 'questions'
})

Paper.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' })
Paper.hasMany(PaperQuestion, { foreignKey: 'paper_id', as: 'paperQuestions' })
PaperQuestion.belongsTo(Paper, { foreignKey: 'paper_id' })
PaperQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question' })

Collection.belongsTo(Question, { foreignKey: 'question_id', as: 'question' })
Question.hasMany(Collection, { foreignKey: 'question_id' })

UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' })
Question.hasMany(UserAnswer, { foreignKey: 'question_id' })

WrongQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question' })
Question.hasMany(WrongQuestion, { foreignKey: 'question_id' })

PracticeProgress.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' })

module.exports = {
  Subject, QuestionType, Difficulty, KnowledgePoint,
  Question, QuestionOption, QuestionKnowledge,
  Paper, PaperQuestion,
  Collection, UserAnswer, WrongQuestion, PracticeProgress
}
