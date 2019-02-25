<html>
  <head>
    <title>component-registry</title>
    <link rel="stylesheet" href="/public/css/home.css" />
  </head>
  <body>
    <div class="header">
      Component Registry
      <div class="apis">
        <a href="/swagger-ui.html" target="_blank">api 文档</a>
      </div>
    </div>

    <div class="projects">
      {% for project in projects%}
      <div class="project">
        <a href="{{ project.name }}/doc">
          <div class="content">
            <div class="cover">
              <p>
                {{ project.name | replace('-', ' ') }}
              </p>
            </div>
            <p>
              {{ project.name }}
            </p>
            <p class="component-count">componentCount: {{ project.componentCount | default(0)}}</p>
          </div>
        </a>
      </div>
      {% endfor %}
    </div>
    <div class="footer">Made with <span class="heart">❤</span> by gmsoft frontend</div>
  </body>
</html>
