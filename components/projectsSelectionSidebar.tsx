
interface ProjectDisplayParams {
    projectName: string;
    projectId: string;
    activeProjectId: string;
}

interface projectInfo {
    mongo_id: string;
    name: string;
  }

interface ProjectsSelectionSidebarParams {
  allProjectDetails: projectInfo[];
  activeProjectId: string;
}

const ProjectDisplay = ({projectName, projectId, activeProjectId}: ProjectDisplayParams) => {
    // TODO Make this interactive; selecting a project name should make it the active project.
    // TODO Display the active project differently.
    var bgColor;
    var className = "rounded p-1";
    if (projectId === activeProjectId) {
        bgColor = "#E6E6E6"
        className = className + " shadow";
    }
    else {
        bgColor = "#F8F9FA"
    }
    return (
        <div className={className} style={{backgroundColor: bgColor}}>
            {projectName}
        </div>
    )
}

const ProjectsSelectionSidebar = ({
  allProjectDetails,
  activeProjectId,
}: ProjectsSelectionSidebarParams) => {
  return <>
    <p style={{fontStyle: "italic", fontSize: "20px"}}>Projects</p>
    {allProjectDetails.map((item, index) => (
        <ProjectDisplay projectName={item.name} projectId={item.mongo_id} activeProjectId={activeProjectId} key={index}/>
    ))}
  </>;
};

export default ProjectsSelectionSidebar;
