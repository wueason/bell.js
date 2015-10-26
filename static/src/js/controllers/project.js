/**
 * @overview  Project controller.
 * @author    Chao Wang (hit9)
 * @copyright 2015 Eleme, Inc. All rights reserved.
 */

app.controller('project', function(self, handlers, util) {
  self.init = function() {
    self.initProjectCreate();
    self.listProject();
    self.initProjectEdit();
  };
  //-----------------------------------------
  // DOM
  //-----------------------------------------
  var dom = {};
  dom.project = {};
  dom.project.create = {};
  dom.project.create.modal = $('.project-create .modal');
  dom.project.create.form = $('.project-create form');
  dom.project.create.error = $('.project-create .error');
  dom.project.list = {};
  dom.project.list.tbody = $('.project-list table tbody');
  dom.project.list.template = $('#template-project-node');
  dom.project.edit = {};
  dom.project.edit.modal = $('.project-edit .modal');
  dom.project.edit.error = $('.project-edit .error');
  dom.project.edit.form = {};
  dom.project.edit.form.projectName = $('.project-edit form.project-name');
  dom.project.edit.form.projectDelete = $('.project-edit button.project-delete');
  //-----------------------------------------
  // Project Create
  //-----------------------------------------
  self.initProjectCreate = function() {
    // form on submit
    dom.project.create.form.submit(function(e) {
      e.preventDefault();
      var data = util.collectForm(this);
      handlers.project.create(data.name, function(err, project) {
        if (err) {
          handlers.error.error(err, dom.project.create.error);
          return;
        }
        dom.project.create.modal.modal('hide');
        self.appendProject(project);
        handlers.error.ok('Project created');
      });
    });
    // modal on hide
    dom.project.create.modal.on('hidden.bs.modal', function(e) {
      dom.project.create.error.html('');
    });
  };
  //-----------------------------------------
  // Project List
  //-----------------------------------------
  self.appendProject = function(project) {
    var template = dom.project.list.template.html();
    var node = nunjucks.renderString(template, {
      project: project,
      url: util.url,
    });
    dom.project.list.tbody.append(node);
    var selector = util.format(".project-list table a[data-name*='%s']", project.name);
    $(selector).click(function(e) {
      e.preventDefault();
      dom.project.edit.modal.modal('show', $(this));
    });
  };
  self.listProject = function() {
    handlers.project.getAll(function(err, projects) {
      if (err)  {
        handlers.error.error(err);
        return;
      }
      projects.forEach(self.appendProject);
    });
  };
  //-----------------------------------------
  // Project edit
  //-----------------------------------------
  self.initProjectEdit = function() {
    self.initProjectEditModal();
  };
  self.initProjectEditModal = function() {
    dom.project.edit.modal.on('show.bs.modal', function(e) {
      var el = $(e.relatedTarget);
      var name = el.data('name');
      self.fillProjectEditModal(name);
    });
  };
  self.fillProjectEditModal = function(name) {
    handlers.project.get(name, function(err, project) {
      if (err) {
        handlers.error.error(err, dom.project.edit.error);
        return;
      }
      util.fillForm(dom.project.edit.form.projectName, project);
      // FIXME (list rules and receivers)
    });
  };
});
