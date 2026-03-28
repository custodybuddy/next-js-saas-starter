import 'dotenv/config';
import postgres from 'postgres';
import { hash } from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL (or POSTGRES_URL) is not set');
}

const sql = postgres(databaseUrl, { ssl: 'require' });

try {
  const email = 'test@test.com';
  const passwordHash = await hash('admin123', 10);

  const users = await sql`
    insert into users (email, password_hash, role)
    values (${email}, ${passwordHash}, 'owner')
    on conflict (email)
    do update set password_hash = excluded.password_hash, role = excluded.role
    returning id
  `;
  const userId = users[0].id;

  const existingTeams = await sql`
    select id from teams where name = 'Test Team' order by id asc limit 1
  `;

  let teamId;
  if (existingTeams.length > 0) {
    teamId = existingTeams[0].id;
  } else {
    const teams = await sql`
      insert into teams (name)
      values ('Test Team')
      returning id
    `;
    teamId = teams[0].id;
  }

  const existingMembership = await sql`
    select id from team_members where user_id = ${userId} and team_id = ${teamId} limit 1
  `;

  if (existingMembership.length === 0) {
    await sql`
      insert into team_members (user_id, team_id, role)
      values (${userId}, ${teamId}, 'owner')
    `;
  }

  console.log(JSON.stringify({ success: true, userId, teamId, email }));
} finally {
  await sql.end();
}
