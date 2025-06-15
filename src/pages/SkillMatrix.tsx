import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/services/dataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Users, Code, TrendingUp } from "lucide-react";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";

const SkillMatrix = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: dataService.getUsers,
  });

  const { data: ideas, isLoading: ideasLoading } = useQuery({
    queryKey: ["ideas"],
    queryFn: dataService.getIdeas,
  });

  const isLoading = usersLoading || ideasLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Skill Matrix</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!users || !ideas) {
    return <ErrorMessage message="Failed to load skill matrix data" />;
  }

  // Extract all unique skills
  const allSkills = Array.from(
    new Set(
      users
        .flatMap((user) => user.skills)
        .concat(ideas.flatMap((idea) => idea.techStack))
    )
  ).sort();

  // Filter skills based on search
  const filteredSkills = allSkills.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get users for a specific skill
  const getUsersForSkill = (skill: string) => {
    return users.filter((user) =>
      user.skills.some((userSkill) =>
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  // Get ideas using a specific skill
  const getIdeasForSkill = (skill: string) => {
    return ideas.filter((idea) =>
      idea.techStack.some((tech) =>
        tech.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  // Get skill statistics
  const getSkillStats = (skill: string) => {
    const skillUsers = getUsersForSkill(skill);
    const skillIdeas = getIdeasForSkill(skill);
    return {
      userCount: skillUsers.length,
      ideaCount: skillIdeas.length,
      trend: Math.floor(Math.random() * 20) - 10, // Mock trend data
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Skill Matrix</h1>
        <Button variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Skills
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {allSkills.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ideas Using Skills
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {ideas.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const stats = getSkillStats(skill);
          const skillUsers = getUsersForSkill(skill);
          const skillIdeas = getIdeasForSkill(skill);

          return (
            <Card
              key={skill}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedSkill === skill ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() =>
                setSelectedSkill(selectedSkill === skill ? null : skill)
              }
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  {skill}
                  {stats.trend > 0 ? (
                    <Badge className="bg-green-100 text-green-800">
                      +{stats.trend}%
                    </Badge>
                  ) : stats.trend < 0 ? (
                    <Badge className="bg-red-100 text-red-800">
                      {stats.trend}%
                    </Badge>
                  ) : (
                    <Badge variant="secondary">0%</Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Users with skill:</span>
                    <span className="font-medium">{stats.userCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ideas using skill:</span>
                    <span className="font-medium">{stats.ideaCount}</span>
                  </div>
                </div>

                {selectedSkill === skill && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Users ({skillUsers.length})
                      </h4>
                      <div className="space-y-1">
                        {skillUsers.slice(0, 3).map((user) => (
                          <div key={user.id} className="text-sm text-gray-600">
                            {user.name} • {user.email}
                          </div>
                        ))}
                        {skillUsers.length > 3 && (
                          <div className="text-sm text-blue-600">
                            +{skillUsers.length - 3} more users
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Ideas ({skillIdeas.length})
                      </h4>
                      <div className="space-y-1">
                        {skillIdeas.slice(0, 2).map((idea) => (
                          <div key={idea.id} className="text-sm text-gray-600">
                            {idea.title} • Stage {idea.currentStage}
                          </div>
                        ))}
                        {skillIdeas.length > 2 && (
                          <div className="text-sm text-blue-600">
                            +{skillIdeas.length - 2} more ideas
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No skills found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillMatrix;
