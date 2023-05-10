
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
    return (<>
        <hr/>
        <p>{projectName}</p>
        <hr/>
        </>
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
