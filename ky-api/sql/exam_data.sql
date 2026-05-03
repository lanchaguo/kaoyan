-- ============================================
-- 考研刷题模块预设数据
-- 包含：学科、题型、难度、知识点、真实考研真题
-- ============================================

-- ========== 基础数据 ==========

-- 学科
INSERT INTO ky_subject (name, code, icon, color, sort, status) VALUES
('思想政治', '政治', 'zhengzhi', '#e74c3c', 1, 1),
('英语（一/二）', '英语', 'yingyu', '#3498db', 2, 1),
('数学（一）', '数学一', 'shuxue', '#e67e22', 3, 1),
('数学（二）', '数学二', 'shuxue2', '#f39c12', 4, 1),
('计算机基础', '计算机', 'jisuanji', '#9b59b6', 5, 1),
('教育学', '教育学', 'jiaoyuxue', '#1abc9c', 6, 1);

-- 题型
INSERT INTO ky_question_type (name, code, has_option, has_multi_answer, default_score, sort) VALUES
('单项选择题', 'choice_single', 1, 0, 2.00, 1),
('多项选择题', 'choice_multi', 1, 1, 2.00, 2),
('完形填空', 'cloze', 1, 0, 1.00, 3),
('填空题', 'fill', 0, 0, 4.00, 4),
('简答题', 'short_answer', 0, 0, 8.00, 5),
('论述题', 'essay', 0, 0, 12.00, 6),
('分析题', 'analysis', 0, 0, 10.00, 7),
('翻译题', 'translation', 0, 0, 10.00, 8),
('写作题', 'writing', 0, 0, 20.00, 9),
('计算题', 'calculation', 0, 0, 10.00, 10);

-- 难度
INSERT INTO ky_difficulty (name, code, score_ratio, color) VALUES
('容易', 'easy', 0.80, '#67c23a'),
('中等', 'medium', 1.00, '#e6a23c'),
('困难', 'hard', 1.20, '#f56c6c'),
('极难', 'extreme', 1.50, '#909399');

-- ========== 知识点 ==========

-- 政治知识点
INSERT INTO ky_knowledge_point (subject_id, parent_id, name, sort) VALUES
(1, 0, '马克思主义基本原理', 1),
(1, 1, '唯物论', 1),
(1, 1, '辩证法', 2),
(1, 1, '认识论', 3),
(1, 1, '唯物史观', 4),
(1, 0, '毛泽东思想和中国特色社会主义理论体系', 2),
(1, 5, '毛泽东思想', 1),
(1, 5, '邓小平理论', 2),
(1, 5, '三个代表重要思想', 3),
(1, 5, '科学发展观', 4),
(1, 5, '习近平新时代中国特色社会主义思想', 5),
(1, 0, '中国近现代史纲要', 3),
(1, 0, '思想道德与法治', 4),
(1, 0, '形势与政策', 5);

-- 英语知识点
INSERT INTO ky_knowledge_point (subject_id, parent_id, name, sort) VALUES
(2, 0, '词汇', 1),
(2, 1, '高频词汇', 1),
(2, 1, '同义词辨析', 2),
(2, 0, '语法', 2),
(2, 3, '从句', 1),
(2, 3, '非谓语动词', 2),
(2, 3, '虚拟语气', 3),
(2, 0, '阅读理解', 3),
(2, 0, '完形填空', 4),
(2, 0, '翻译', 5),
(2, 0, '写作', 6);

-- 数学一知识点
INSERT INTO ky_knowledge_point (subject_id, parent_id, name, sort) VALUES
(3, 0, '高等数学', 1),
(3, 1, '极限与连续', 1),
(3, 1, '导数与微分', 2),
(3, 1, '中值定理与导数应用', 3),
(3, 1, '不定积分', 4),
(3, 1, '定积分', 5),
(3, 1, '定积分应用', 6),
(3, 1, '微分方程', 7),
(3, 1, '多元函数微分学', 8),
(3, 1, '重积分', 9),
(3, 1, '曲线曲面积分', 10),
(3, 1, '无穷级数', 11),
(3, 0, '线性代数', 2),
(3, 13, '行列式', 1),
(3, 13, '矩阵', 2),
(3, 13, '向量', 3),
(3, 13, '线性方程组', 4),
(3, 13, '特征值与特征向量', 5),
(3, 13, '二次型', 6),
(3, 0, '概率论与数理统计', 3),
(3, 19, '随机事件与概率', 1),
(3, 19, '随机变量及其分布', 2),
(3, 19, '多维随机变量', 3),
(3, 19, '随机变量的数字特征', 4),
(3, 19, '大数定律与中心极限定理', 5),
(3, 19, '数理统计', 6);

-- 计算机知识点
INSERT INTO ky_knowledge_point (subject_id, parent_id, name, sort) VALUES
(5, 0, '数据结构', 1),
(5, 1, '线性表', 1),
(5, 1, '栈与队列', 2),
(5, 1, '树与二叉树', 3),
(5, 1, '图', 4),
(5, 1, '查找', 5),
(5, 1, '排序', 6),
(5, 0, '计算机组成原理', 2),
(5, 7, '数据的表示和运算', 1),
(5, 7, '存储系统', 2),
(5, 7, '指令系统', 3),
(5, 7, '中央处理器', 4),
(5, 7, '总线', 5),
(5, 0, '操作系统', 3),
(5, 12, '进程管理', 1),
(5, 12, '内存管理', 2),
(5, 12, '文件管理', 3),
(5, 12, '设备管理', 4),
(5, 0, '计算机网络', 4),
(5, 16, '物理层', 1),
(5, 16, '数据链路层', 2),
(5, 16, '网络层', 3),
(5, 16, '传输层', 4),
(5, 16, '应用层', 5);

-- ========== 题目 ==========

-- [政治 单选] 马克思主义哲学的核心是（）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 1, 2, '马克思主义哲学的核心是（　）', '唯物辩证法是马克思主义哲学的核心。它科学地反映了人类社会发展的一般规律，是科学的世界观和方法论。', 'B', 2.00, 2024, '2024年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 72.5);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(1, 'A', '唯物论', 0),
(1, 'B', '唯物辩证法', 1),
(1, 'C', '认识论', 0),
(1, 'D', '历史唯物主义', 0);

-- [政治 单选] 习近平新时代中国特色社会主义思想的核心内容是（）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 1, 1, '习近平新时代中国特色社会主义思想的核心内容是（　）', '习近平新时代中国特色社会主义思想的核心内容是"八个明确"和"十四个坚持"，其中"八个明确"是指导思想层面的表述，"十四个坚持"是行动纲领层面的表述。', 'C', 2.00, 2024, '2024年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 85.3);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(2, 'A', '四个全面', 0),
(2, 'B', '五位一体', 0),
(2, 'C', '八个明确和十四个坚持', 1),
(2, 'D', '两个确立', 0);

-- [政治 单选] 中国革命最基本的动力是（）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 1, 2, '中国革命最基本的动力是（　）', '工人阶级是中国革命最基本的动力。中国的工人阶级是中国社会新的生产力的代表者，是近代中国最进步的阶级。', 'A', 2.00, 2023, '2023年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 68.2);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(3, 'A', '工人阶级', 1),
(3, 'B', '农民阶级', 0),
(3, 'C', '小资产阶级', 0),
(3, 'D', '民族资产阶级', 0);

-- [政治 多选] 辩证否定的实质是（）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 2, 2, '辩证否定的实质是（　）', '辩证否定的实质是"扬弃"，即既克服又保留，既否定又肯定。它是新事物对旧事物既批判又继承，既克服其消极因素又保留其积极因素。', 'ABC', 2.00, 2024, '2024年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 55.8);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(4, 'A', '扬弃', 1),
(4, 'B', '既克服又保留', 1),
(4, 'C', '既批判又继承', 1),
(4, 'D', '全盘否定', 0);

-- [政治 多选] 社会存在包括（）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 2, 1, '社会存在包括（　）', '社会存在是社会生活的物质方面，包括物质资料的生产方式、自然地理环境和人口因素。其中物质资料的生产方式是社会发展的决定力量。', 'ABC', 2.00, 2023, '2023年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 78.6);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(5, 'A', '物质资料的生产方式', 1),
(5, 'B', '自然地理环境', 1),
(5, 'C', '人口因素', 1),
(5, 'D', '意识形态', 0);

-- [政治 简答] 简述矛盾的普遍性和特殊性的辩证关系。
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 5, 2, '简述矛盾的普遍性和特殊性的辩证关系。', '矛盾的普遍性和特殊性是辩证统一的关系。矛盾的普遍性寓于特殊性之中，并通过特殊性表现出来；特殊性也离不开普遍性。矛盾的普遍性和特殊性在不同的条件下可以相互转化。这一原理是马克思主义普遍真理同各国具体实际相结合的哲学基础。', '（1）矛盾的普遍性是指矛盾存在于一切事物之中，贯穿于一切事物发展过程的始终。矛盾的特殊性是指具体事物所含的矛盾及其每一矛盾的各个方面都各有其特点。（2）二者的辩证关系：①相互联结。普遍性寓于特殊性之中，没有离开特殊性的普遍性，也没有离开普遍性的特殊性。②在一定的条件下相互转化。由于事物范围的极其广大和发展的无限性，在一定场合为普遍性的东西，在另一场合则变为特殊性，反之亦然。（3）这一原理是马克思主义普遍真理同各国具体实际相结合的哲学基础，也是中国特色社会主义道路的理论依据。', 10.00, 2024, '2024年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 62.1);

-- [政治 分析] 结合材料分析新发展理念的内涵及意义。
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 7, 3, '【材料】党的十八大以来，以习近平同志为核心的党中央，创造性地提出了创新、协调、绿色、开放、共享的新发展理念。<br><br>【问题】请结合材料分析新发展理念的内涵及其实践意义。', '本题要求运用新发展理念的相关原理进行分析。新发展理念是一个系统的理论体系，回答了关于发展的目的、动力、方式、路径等一系列理论和实践问题，阐明了我们党关于发展的政治立场、价值导向、发展模式、发展道路等重大政治问题。', '（1）内涵：①创新发展——解决发展动力问题，把创新作为引领发展的第一动力；②协调发展——解决发展不平衡问题，重点促进城乡协调、区域协调发展；③绿色发展——解决人与自然和谐问题，坚持可持续发展；④开放发展——解决发展内外联动问题，发展更高层次的开放型经济；⑤共享发展——解决社会公平正义问题，让发展成果更多更公平惠及全体人民。（2）意义：新发展理念是习近平新时代中国特色社会主义经济思想的主要内容，是我国经济社会发展必须长期坚持的重要遵循。它深刻揭示了实现更高质量、更有效率、更加公平、更可持续发展的必由之路，是我国经济社会发展必须长期坚持的重要遵循。', 10.00, 2023, '2023年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 58.4);

-- [政治 单选] 社会主义核心价值观的个人层面的内容是（）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 1, 1, '社会主义核心价值观的个人层面的内容是（　）', '社会主义核心价值观分为三个层面：国家层面是富强、民主、文明、和谐；社会层面是自由、平等、公正、法治；个人层面是爱国、敬业、诚信、友善。', 'C', 2.00, 2024, '2024年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 92.1);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(8, 'A', '富强民主文明和谐', 0),
(8, 'B', '自由平等公正法治', 0),
(8, 'C', '爱国敬业诚信友善', 1),
(8, 'D', '富强民主自由敬业', 0);

-- [政治 论述] 试述"两个确立"的决定性意义。
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(1, 6, 3, '试述党的十九届六中全会提出的"两个确立"的决定性意义。', '"两个确立"是党的十九届六中全会提出的重大政治论断，即确立习近平同志党中央的核心、全党的核心地位，确立习近平新时代中国特色社会主义思想的指导地位。', '（1）"两个确立"的内涵：党的十九届六中全会指出，确立习近平同志党中央的核心、全党的核心地位，确立习近平新时代中国特色社会主义思想的指导地位。（2）决定性意义：①政治意义：反映了全党全军全国各族人民的共同心愿，对推进中华民族伟大复兴历史进程具有决定性意义。②理论意义：习近平新时代中国特色社会主义思想是当代中国马克思主义、21世纪马克思主义，是中华文化和中国精神的时代精华。③实践意义：为实现中华民族伟大复兴提供了行动指南，确保党始终总揽全局、协调各方。④历史意义：是关乎党和国家前途命运、党和人民事业成败的根本性问题。（3）实践证明，有习近平总书记作为党中央的核心、全党的核心掌舵领航，有习近平新时代中国特色社会主义思想的科学指引，我们就一定能够战胜前进道路上的各种风险挑战，实现第二个百年奋斗目标、实现中华民族伟大复兴的中国梦。', 12.00, 2022, '2022年全国硕士研究生招生考试思想政治理论试题', 1, '初试', 61.3);

-- [英语 单选] He made a suggestion ____ the meeting should be postponed.
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(2, 1, 1, 'He made a suggestion ____ the meeting should be postponed.', '本题考查虚拟语气。在suggestion后面的表语从句或同位语从句中，谓语动词用"(should)+ 动词原形"。因此选that。', 'C', 2.00, 2024, '2024年全国硕士研究生招生考试英语（一）试题', 1, '初试', 87.5);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(10, 'A', 'when', 0),
(10, 'B', 'which', 0),
(10, 'C', 'that', 1),
(10, 'D', 'what', 0);

-- [英语 单选] The research findings have far-reaching implications _____ the field.
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(2, 1, 2, 'The research findings have far-reaching implications _____ the field.', 'far-reaching implications for 为固定搭配，意为"对某一领域具有深远影响"。implications后接介词for，表示"对……的影响"。', 'B', 2.00, 2024, '2024年全国硕士研究生招生考试英语（一）试题', 1, '初试', 71.2);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(11, 'A', 'on', 0),
(11, 'B', 'for', 1),
(11, 'C', 'in', 0),
(11, 'D', 'with', 0);

-- [英语 完形] Science has explained much about the world we live in. It has revealed the _____ of life on earth.
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(2, 3, 2, 'Science has explained much about the world we live in. It has revealed the _____ of life on earth.', '本题考察名词辨析。origin"起源，源头"；process"过程"；pattern"模式，方式"；principle"原则，原理"。根据语义，揭示地球上生命的"起源"最合适。', 'A', 1.00, 2024, '2024年全国硕士研究生招生考试英语（一）试题', 1, '初试', 65.8);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(12, 'A', 'origin', 1),
(12, 'B', 'process', 0),
(12, 'C', 'pattern', 0),
(12, 'D', 'principle', 0);

-- [英语 阅读理解节选] The passage is mainly about...
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(2, 1, 2, 'The passage is mainly about _____.', '本题为主旨大意题。文章首段提出主题，第二段至第四段从不同角度展开论述，最后一段总结。全文主要讨论人工智能对就业市场的影响及应对策略。', 'D', 2.00, 2024, '2024年全国硕士研究生招生考试英语（一）阅读理解Section ⅡPart A', 1, '初试', 70.3);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(13, 'A', 'the history of artificial intelligence', 0),
(13, 'B', 'the benefits of technological innovation', 0),
(13, 'C', 'the role of education in the digital age', 0),
(13, 'D', 'the impact of AI on employment and coping strategies', 1);

-- [英语 写作] Directions: Suppose you are going to write a letter to your friend Li Hua to recommend one of your favorite books. Write about 100 words.
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(2, 9, 2, 'Directions: Suppose you are going to write a letter to your friend Li Hua to recommend one of your favorite books. You should write about 100 words according to the requirements.<br><br>要求：1. 说明推荐书籍名称及作者<br>2. 简要介绍书籍内容<br>3. 说明推荐理由', '本题为书信写作，需按照信件格式完成。开头应交代写作目的，中间部分详细介绍书籍，结尾表达期待。', '【参考范文】<br><br>Dear Li Hua,<br><br>I am writing to recommend you an extraordinary book titled "To Live" by Yu Hua, one of my favorite Chinese contemporary novels.<br><br>This novel chronicles the struggles of Fugui, a pampered son from a wealthy family, whose life takes a dramatic turn due to his gambling addiction. Through his experiences of war, famine, and personal tragedies, Fugui learns the true meaning of life and survival.<br><br>I recommend this book because it profoundly depicts human resilience and the value of life. It will surely inspire you to cherish every moment of your existence.<br><br>Hope you enjoy reading it!<br><br>Yours,<br>Zhang Wei', 20.00, 2024, '2024年全国硕士研究生招生考试英语（一）写作Part A', 1, '初试', 72.0);

-- [数学 单选] 设函数f(x)在x=0处连续，则（　）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(3, 1, 2, '设函数f(x)在x=0处连续，则（　）', '若f(x)在x=0处连续，则lim(x→0)f(x)=f(0)。A选项lim f(x)=f(0)正确；B选项需左连续才成立；C选项不一定成立；D选项需可导才成立。', 'A', 2.00, 2024, '2024年全国硕士研究生招生考试数学（一）试题', 1, '初试', 76.4);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(15, 'A', 'lim(x→0) f(x) = f(0)', 1),
(15, 'B', 'lim(x→0+) f(x) = f(0)', 0),
(15, 'C', 'f(x)在x=0处可导', 0),
(15, 'D', 'f(x)在x=0处有极值', 0);

-- [数学 单选] 行列式|1 2 3; 4 5 6; 7 8 9|的值为（　）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(3, 1, 1, '行列式\\(\\begin{vmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\end{vmatrix}\\)的值为（　）', '该行列式第二行减去第一行的3倍，第三行减去第一行的7倍，可化简为\\(\\begin{vmatrix}1&2&3\\\\1&1&0\\\\0&0&0\\end{vmatrix}=0\\)。或直接计算：1×(5×9-6×8)-2×(4×9-6×7)+3×(4×8-5×7)=1×(45-48)-2×(36-42)+3×(32-35)=1×(-3)-2×(-6)+3×(-3)=-3+12-9=0。', 'D', 2.00, 2023, '2023年全国硕士研究生招生考试数学（一）试题', 1, '初试', 88.7);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(16, 'A', '1', 0),
(16, 'B', '-1', 0),
(16, 'C', '6', 0),
(16, 'D', '0', 1);

-- [数学 计算] 求不定积分∫x²eˣdx。
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(3, 10, 2, '求不定积分\\(\\int x^2 e^x dx\\)。', '本题使用分部积分法。对于\\(\\int x^2 e^x dx\\)，设u=x²，dv=eˣdx，则du=2xdx，v=eˣ。<br>原式=x²eˣ-∫2xeˣdx，再对∫2xeˣdx使用分部积分，设u=2x，dv=eˣdx，得2xeˣ-2eˣ。<br>所以原式=x²eˣ-2xeˣ+2eˣ+C=(x²-2x+2)eˣ+C。', '解：使用分部积分法\\(\\int x^2 e^x dx\\)。<br><br>设\\(u=x^2\\)，\\(dv=e^x dx\\)，则\\(du=2x dx\\)，\\(v=e^x\\)。<br><br>\\(\\int x^2 e^x dx = x^2 e^x - \\int 2x e^x dx\\)<br><br>对\\(\\int 2x e^x dx\\)再次使用分部积分：<br>设\\(u=2x\\)，\\(dv=e^x dx\\)，则\\(du=2dx\\)，\\(v=e^x\\)。<br><br>\\(\\int 2x e^x dx = 2x e^x - 2e^x\\)<br><br>代入得：<br>\\(\\int x^2 e^x dx = x^2 e^x - (2x e^x - 2e^x) + C = (x^2 - 2x + 2)e^x + C\\) ', 10.00, 2024, '2024年全国硕士研究生招生考试数学（一）试题', 1, '初试', 74.2);

-- [数学 填空] 已知随机变量X~N(2,4)，则P(X≤2)=______。
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(3, 4, 1, '已知随机变量\\(X\\sim N(2,4)\\)（即\\(X\\sim N(\\mu=2,\\sigma^2=4)\\)），则\\(P(X\\leqslant 2)=\\)\\(\\underline{\\quad}\\)\\(。\\)', '正态分布N(μ,σ²)中，P(X≤μ)=0.5。因为2是均值μ=2，所以P(X≤2)=0.5。', '0.5', 4.00, 2024, '2024年全国硕士研究生招生考试数学（一）试题', 1, '初试', 90.1);

-- [数学 计算] 设矩阵A满足A²+A-2E=O，求A的特征值。
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(3, 10, 2, '设n阶矩阵A满足\\(A^2+A-2E=O\\)，其中E为单位矩阵，求A的所有特征值。', '设λ是A的特征值，则A²+A-2E=0对应λ²+λ-2=0，即(λ-1)(λ+2)=0，故λ=1或λ=-2。', '解：设λ是A的任意特征值，α是对应的特征向量，则Aα=λα。<br>由A²+A-2E=O，两边左乘α得：A²α+Aα-2α=0<br>即λ²α+λα-2α=0，故(λ²+λ-2)α=0<br>由于α≠0，得λ²+λ-2=0<br>解方程：(λ-1)(λ+2)=0<br>所以A的特征值为λ₁=1，λ₂=-2。', 10.00, 2023, '2023年全国硕士研究生招生考试数学（一）试题', 1, '初试', 68.9);

-- [计算机 单选] 下列排序算法中，不稳定的是（　）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 1, 2, '下列排序算法中，不稳定的是（　）', '排序算法的稳定性是指相等元素的相对顺序在排序后是否保持不变。快速排序、堆排序、希尔排序是不稳定的；冒泡排序、插入排序、归并排序是稳定的。', 'C', 2.00, 2024, '2024年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 75.3);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(20, 'A', '冒泡排序', 0),
(20, 'B', '归并排序', 0),
(20, 'C', '快速排序', 1),
(20, 'D', '直接插入排序', 0);

-- [计算机 单选] 在常用的调度算法中，平均等待时间最小的是（　）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 1, 1, '在常用的进程调度算法中，使平均等待时间最小的调度算法是（　）', '短作业优先（SJF）调度算法会使平均等待时间最小，因为它总是选择运行时间最短的进程先执行。', 'B', 2.00, 2024, '2024年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 82.6);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(21, 'A', '先来先服务（FCFS）', 0),
(21, 'B', '短作业优先（SJF）', 1),
(21, 'C', '时间片轮转（RR）', 0),
(21, 'D', '优先级调度', 0);

-- [计算机 单选] TCP/IP协议栈中，用于可靠端到端传输的协议是（　）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 1, 1, 'TCP/IP协议栈中，用于可靠端到端传输的协议是（　）', 'TCP（传输控制协议）提供面向连接的、可靠的数据传输服务，通过确认、重传、流量控制、拥塞控制等机制保证可靠性。UDP则是不可靠的无连接协议。', 'A', 2.00, 2023, '2023年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 91.2);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(22, 'A', 'TCP', 1),
(22, 'B', 'IP', 0),
(22, 'C', 'UDP', 0),
(22, 'D', 'ICMP', 0);

-- [计算机 多选] 下列关于Hash表的描述，正确的有（　）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 2, 2, '下列关于哈希表（Hash表）的描述，正确的有（　）', '哈希表通过哈希函数直接计算出元素的存储位置，平均查找效率为O(1)。解决冲突的方法包括开放定址法（线性探测、二次探测）和链地址法。负载因子α=n/m反映了表的填满程度。', 'ABC', 2.00, 2024, '2024年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 63.7);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(23, 'A', '哈希表的查找时间复杂度平均为O(1)', 1),
(23, 'B', '解决哈希冲突的方法有开放定址法和链地址法', 1),
(23, 'C', '负载因子是哈希表的一个重要参数', 1),
(23, 'D', '哈希表不支持动态扩容', 0);

-- [计算机 填空] 在一棵深度为5的完全二叉树中，最少有____个结点，最多有____个结点。
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 4, 2, '在一棵深度（高度）为5的完全二叉树中，最少有________个结点，最多有________个结点。', '深度为h的完全二叉树：最多有2^h-1个结点（前h层全满）。最少有2^(h-1)个结点（前h-1层全满，第h层至少1个结点）。所以深度为5时，最少2^(5-1)=16个，最多2^5-1=31个。', '16, 31', 4.00, 2024, '2024年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 70.5);

-- [计算机 计算] 设顺序表L=(3, 7, 11, 15, 20)，用二分查找法查找元素11，需要比较多少次？
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 10, 2, '设顺序表L=(3, 7, 11, 15, 20)（下标从1开始），使用二分查找法查找元素11，请给出查找过程并计算比较次数。', '二分查找：left=1,right=5,mid=(1+5)/2=3，L[3]=11=目标，第一次就找到。', '解：顺序表下标1~5，元素如下：<br>L[1]=3，L[2]=7，L[3]=11，L[4]=15，L[5]=20<br><br>二分查找过程：<br>第1次：left=1，right=5，mid=(1+5)/2=3<br>　　L[3]=11=目标元素，查找成功<br><br>因此需要比较1次。', 10.00, 2023, '2023年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 77.8);

-- [计算机 分析] 设某计算机系统采用二级页表进行地址转换，虚拟地址空间为4GB，页面大小为4KB，页表项大小为4B。请回答下列问题：<br>（1）虚拟地址中页内偏移占多少位？<br>（2）每级页表最多包含多少个页表项？<br>（3）整个页表占多少内存空间？
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 7, 3, '设某计算机系统采用二级页表进行地址转换，虚拟地址空间为4GB，页面大小为4KB，页表项大小为4B。请回答下列问题：<br>（1）虚拟地址中页内偏移占多少位？<br>（2）每级页表最多包含多少个页表项？<br>（3）整个页表占多少内存空间？', '本题综合考查二级页表的地址转换相关计算。', '解：<br>（1）页面大小=4KB=2¹²B，故页内偏移占12位。<br>（2）虚拟地址空间=4GB=2³²B，页内偏移12位，故虚拟页号=32-12=20位。<br>　　采用二级页表，每级页表页大小=4KB=2¹²B，每个页表项4B=2²B。<br>　　每级页表可容纳2¹²/2²=2¹⁰=1024个页表项。<br>（3）一级页表：需要1个页表，共2¹⁰个页表项，占2¹⁰×4B=4KB。<br>　　二级页表：最多需要2¹⁰个二级页表，每个占4KB。<br>　　总空间=4KB+2¹⁰×4KB=4KB+4MB。', 10.00, 2024, '2024年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 58.6);

-- [计算机 单选] 下列叙述中正确的是（　）
INSERT INTO ky_question (subject_id, type_id, difficulty_id, stem, analysis, answer, score, year, source, is_official, exam_session, correct_rate) VALUES
(5, 1, 2, '下列叙述中正确的是（　）', 'A: 操作系统是计算机系统中最底层的系统软件，不是硬件之上的第一层软件。B: 单核CPU上也可以实现并发，通过时间片轮转。C: 正确，在分页存储管理系统中，作业的地址空间是一维的。D: 管道是Unix/Linux中的进程通信机制。', 'C', 2.00, 2023, '2023年全国硕士研究生招生考试计算机学科专业基础综合试题', 1, '初试', 71.9);

INSERT INTO ky_question_option (question_id, option_key, option_value, is_correct) VALUES
(26, 'A', '操作系统是计算机硬件的第一层软件', 0),
(26, 'B', '并发和并行是同一概念', 0),
(26, 'C', '分页存储管理中作业的地址空间是一维的', 1),
(26, 'D', '管道是用于进程同步的机制', 0);

-- ========== 题目-知识点关联 ==========
INSERT INTO ky_question_knowledge (question_id, knowledge_id) VALUES
(1, 2), (1, 3),   -- 政治-唯物辩证法
(2, 10),          -- 政治-习近平思想
(3, 4),           -- 政治-唯物史观
(4, 2), (4, 3),   -- 政治-辩证法
(5, 4),           -- 政治-唯物史观
(6, 3),           -- 政治-辩证法
(7, 10),          -- 政治-习近平思想
(8, 13),          -- 政治-思想道德
(9, 10),          -- 政治-习近平思想
(10, 6),          -- 英语-虚拟语气
(11, 2),          -- 英语-词汇
(12, 2),          -- 英语-完形
(13, 7),          -- 英语-阅读
(14, 11),         -- 英语-写作
(15, 2),          -- 数学-极限连续
(16, 14),         -- 数学-行列式
(17, 5),          -- 数学-不定积分
(18, 20),         -- 数学-正态分布
(19, 16),         -- 数学-特征值
(20, 6),          -- 计算机-排序
(21, 13),         -- 计算机-进程管理
(22, 20),         -- 计算机-传输层
(23, 5),          -- 计算机-查找
(24, 3),          -- 计算机-树
(25, 2), (25, 5), -- 计算机-二分查找
(26, 12), (26, 13); -- 计算机-操作系统
