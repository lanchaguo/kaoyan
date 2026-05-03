const { Sequelize } = require('sequelize');
const dbConfig = require('./src/config/db');

const seq = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect || 'mysql',
    pool: dbConfig.pool
  }
);

async function checkQuestions() {
  try {
    // 检查各学科题目数量
    const subjectCounts = await seq.query(`
      SELECT subject_id, COUNT(*) as count 
      FROM ky_question 
      GROUP BY subject_id 
      ORDER BY subject_id
    `, { type: Sequelize.QueryTypes.SELECT });
    
    console.log('各学科题目数量:');
    console.log(JSON.stringify(subjectCounts, null, 2));
    
    // 检查所有题目
    const totalCount = await seq.query('SELECT COUNT(*) as total FROM ky_question', 
      { type: Sequelize.QueryTypes.SELECT });
    console.log('\n总题目数:', totalCount[0].total);
    
    // 检查subject_id=5是否有题目
    const subject5 = await seq.query('SELECT COUNT(*) as count FROM ky_question WHERE subject_id = 5', 
      { type: Sequelize.QueryTypes.SELECT });
    console.log('subject_id=5 的题目数:', subject5[0].count);
    
    // 查看前几道题目的subject_id
    const samples = await seq.query('SELECT id, subject_id, LEFT(stem, 30) as stem_preview FROM ky_question LIMIT 5', 
      { type: Sequelize.QueryTypes.SELECT });
    console.log('\n题目样本:');
    console.log(JSON.stringify(samples, null, 2));
    
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await seq.close();
  }
}

checkQuestions();
