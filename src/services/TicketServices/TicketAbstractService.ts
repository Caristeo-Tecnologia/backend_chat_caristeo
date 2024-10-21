import { QueryTypes } from "sequelize";
import sequelize from "../../database";

const TicketAbstractService = async (ticketId: string) => {
  const sql = `
    ;with cte as(
    select
      m.*,
      row_number() over(
      order by m."createdAt") as sequence
    from
      "Messages" m
    inner join "Tickets" t on
      t.id = m."ticketId"
    where
      t.id = ${ticketId}
      and m."createdAt" >= t."pendingAt"
    )
    select * from (
      select * from cte c1
      where 
        "fromQueue" = true and "hasOption" = true and "fromMe" = true
      union all
      select * from cte c2
      where (c2.sequence - 1) in (
        select
          sequence from cte c1
        where 
          "fromQueue" = true and "hasOption" = true)
        and "fromMe" = false
    ) as t1
    order by sequence
  `

  const data = await sequelize.query(sql, {
    type: QueryTypes.SELECT
  });

  const response = [];

  const iter = data.length % 2 === 0 ? data.length / 2 : (data.length - 1) / 2;

  for (let index = 0; index < iter; index++) {
    const question = data[index*2]['body'].split("*[")[0];
    const answerBody = data[index*2]['body'];
    if (data[index*2 + 1]['body'] !== '0' && data[index*2 + 1]['body'] !== '#') {
      let answer = answerBody.split('\n').find(item => item.includes(`*[ ${data[index*2 + 1]['body']} ]*`));
    
      if (answer) {
        answer = answer.match(/\*\[\s\d\s\]\*\s-\s(.+)/)[1];
      } else {
        answer = answerBody;
      }
      
      response.push({
        question,
        answer
      });
    }
  }

  return response;
};

export default TicketAbstractService;