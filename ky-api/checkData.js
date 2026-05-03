const { sequelize } = require('./src/config/db');

async function checkData() {
  try {
    // 检查各学科题目数量
    const subjectCounts = await sequelize.query(`
      SELECT subject_id, COUNT(*) as count 
      FROM ky_question 
      GROUP BY subject_id 
      ORDER BY subject_id
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('=== 各学科题目数量 ===');
    console.log(JSON.stringify(subjectCounts, null, 2));
    
    // 检查总题目数
    const [totalResult] = await sequelize.query('SELECT COUNT(*) as total FROM ky_question');
    console.log('\n=== 总题目数 ===');
    console.log(totalResult);
    
    // 检查subject表
    const subjects = await sequelize.query('SELECT id, name FROM ky_subject ORDER BY id', 
      { type: sequelize.QueryTypes.SELECT });
    console.log('\n=== 学科列表 ===');
    console.log(JSON.stringify(subjects, null, 2));
    
    // 检查subject_id=5是否有题目
    const [subject5Result] = await sequelize.query('SELECT COUNT(*) as count FROM ky_question WHERE subject_id = 5');
    console.log('\nsubject_id=5 的题目数:', subject5Result);
    
  } catch (error) {
    console.error('错误:', error.message);
    console.error('详细错误:', error);
  } finally {
    await sequelize.close();
  }
}

checkData();
