# Autonomous-Car-GPS-Guiding
Code for the guiding of the autonomous car, outdoor, with a GPS

## Installation 

This is not actually a ROS package, but it connects to ROS to get informations from GPS sensor, and uses some ROS functionnality, for instance ROS param, ROS topic, etc.

To allow this application to connect with ROS, you need to install RosBridge, who is kind of a bridge to connect some Javascript apps to the ROS core. To do so, please follow the tutorial [here](http://wiki.ros.org/rosbridge_suite/Tutorials/RunningRosbridge).

In order to launch rosbridge with the rest of your stuff, you can add this to your launch file :


    <launch>
        <include file="$(find rosbridge_server)/launch/rosbridge_websocket.launch" > 
            <arg name="port" value="8080"/>
        </include>
    </launch>


## Configuration

The configuration of the module can be modified just by changing the value at the top of the script.js file.

- `CONFIG_default_gps_topic_name` : Set the name of the GPS topic the app is going to listen to
- `CONFIG_cycles_number` : If the GPS is publishing really really fast, the app doesn't have the time to update the marker at each cycle, causing some delay. This parameters sets the number of cycles between each actualisation.
- `CONFIG_tile_source` : Set the source of the tiles for the map. If you downloaded the maps of the area you want to move in, then you can set it to `local`. Else, set it to `server`.
- `CONFIG_tile_local_path` : Path to the downloaded tiles
- `CONFIG_ROS_server_URI` : Route to ROS server. It could be localhost or an IP.
