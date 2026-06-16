'use client';

import { useAuth } from '@/components/layout/auth-provider';
import { MOCK_USERS, getRegisteredUsers, MOCK_TEAMS } from '@/lib/auth';
import { Terminal, Users as UsersIcon, Shield, Mail, BadgeCheck } from 'lucide-react';

export default function TeamPage() {
  const { user, team } = useAuth();

  const allUsers = [...MOCK_USERS, ...getRegisteredUsers()];
  const teamMembers = team
    ? allUsers.filter(u => u.teamId === team.id)
    : allUsers;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-emerald-500" />
        <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">Team Members</h2>
      </div>

      {team && (
        <div className="border border-emerald-800/20 p-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <UsersIcon className="h-3.5 w-3.5" />
            {team.name}
          </div>
          <p className="text-emerald-600">
            {team.memberCount} members · {team.plan} plan
          </p>
        </div>
      )}

      <div className="grid gap-2">
        {teamMembers.map(m => {
          const isYou = m.id === user?.id;
          const isMock = MOCK_USERS.find(u => u.id === m.id);
          return (
            <div
              key={m.id}
              className={`border p-4 text-xs flex items-center gap-4 ${
                isYou ? 'border-emerald-600/40 bg-emerald-950/15' : 'border-emerald-800/20 bg-gray-950'
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-emerald-700/30 border border-emerald-600/40 flex items-center justify-center text-sm font-bold text-emerald-300">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-300 font-medium">{m.name}</span>
                  {isYou && <BadgeCheck className="h-3 w-3 text-emerald-500" />}
                  {isMock && <span className="text-[8px] text-amber-500 uppercase border border-amber-800/30 px-1">demo</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {m.email}
                  </span>
                  <span className="flex items-center gap-1 uppercase">
                    <Shield className="h-3 w-3" />
                    {m.role}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {teamMembers.length === 0 && (
        <div className="border border-emerald-800/20 p-6 text-center">
          <p className="text-xs text-emerald-600">No team members found.</p>
        </div>
      )}
    </div>
  );
}
