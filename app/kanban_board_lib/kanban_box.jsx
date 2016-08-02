'use strict';
import React from 'react';
import KanbanColumns from './kanban_columns.jsx';
import style from './kanban_box.scss';
import NewCard from './kanban_new_card.jsx';


class KanbanBox extends React.Component {
  constructor(){
    super();
    this.state = {
      data: [],
      todo: [],
      doing: [],
      done: []
    };
    this.onPostData = this.onPostData.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  onPostData(data) {
    const parsedData = JSON.parse(data.currentTarget.response);
    this.setState({
      data: parsedData,
      todo: parsedData.filter((datuh)=>{
        return datuh.status === 'todo';
      }),
      doing: parsedData.filter((datuh)=>{
        return datuh.status === 'doing';
      }),
      done: parsedData.filter((datuh)=>{
        return datuh.status === 'done';
      })
    });
  }


  loadData(){
    const req = new XMLHttpRequest();
    req.addEventListener("load", this.onPostData);
    req.open("GET", "/test");
    req.send();
  }

  updateHandler(uniqueId,props,status){
    var that = this;
    const req = new XMLHttpRequest();
    req.addEventListener("load", function(){
      if(this.responseText){
        that.loadData();
      }

    });
    req.open("PUT", `/test/${uniqueId}`);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({
      "title": `${props.title}`,
      "priority": `${props.priority}`,
      "status": `${status}`,
      "createdBy": `${props.createdBy}`,
      "assignedTo": `${props.assignedTo}`
    }));
  }

  handlePost(newCard) {
      var componentContext = this;
      const req = new XMLHttpRequest();
      req.addEventListener("load", function() {
        console.log(this.responseText);
        componentContext.loadData();
      });
      req.open("POST", "/test");
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify(newCard));
  }

  componentDidMount() {
      this.loadData();
  };

  render(){
    return(
      <div className="kanban">
        <h1>Kanban Board</h1>
        <div className="kantainer">
          <KanbanColumns title='To-Do' data={this.state.todo} updateHandler={this.updateHandler} />
          <KanbanColumns title='Doing' data={this.state.doing} updateHandler={this.updateHandler} />
          <KanbanColumns title='Done' data={this.state.done} updateHandler={this.updateHandler} />
          <NewCard handlePost={this.handlePost} />
        </div>
      </div>
    );
  };
};

KanbanBox.propTypes = {
  data: React.PropTypes.array
};

KanbanBox.defaultProps = {
  data: []
}

export default KanbanBox;