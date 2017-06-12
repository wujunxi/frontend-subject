### 背景

- 项目测试模拟数据文件按需求分文件夹存放，通过Fiddler映射，配置文件为一个xml文件，其中存在无效配置。

- 这个配置文件不在svn管理中，导致不同开发者配置不同步。

- 相同请求路径的文件不能方便管理。

### 目标

将测试文件按请求路径存放，过滤掉无效配置，统一为json文件，并生成新的配置文件。