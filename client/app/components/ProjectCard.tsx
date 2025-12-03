import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Project } from '../lib/types';

type ProjectCardProps = {
  project: Project;
  onClick?: (project: Project) => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-80">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2 text-sm text-green-400 mb-2">
          <Calendar size={16} />
          <span>{project.year}</span>
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
        
        <p className="text-gray-300 text-sm mb-1">Client: {project.client}</p>
        
        {project.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <button className="flex items-center gap-2 text-green-400 font-semibold group-hover:gap-3 transition-all">
          View Details <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
