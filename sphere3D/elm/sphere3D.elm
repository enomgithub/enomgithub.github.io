import Browser
import Browser.Events exposing (onAnimationFrameDelta)
import Html exposing (Html)
import Html.Attributes exposing(height, style, width)
import Json.Decode exposing (Value)
import List exposing (concat, indexedMap, map, map2, range, repeat)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 as Vec3 exposing (vec3, Vec3)
import WebGL exposing (Mesh, Shader)


-- MAIN

type alias Model =
  Float

type Msg
  = Delta Float

main : Program () Model Msg
main =
  Browser.element
    { init = init
    , view = view
    , subscriptions = subscriptions
    , update = update
    }


-- INIT

init : () -> ( Model, Cmd Msg )
init _ =
  ( 0, Cmd.none )


-- UPDATE

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Delta dt ->
      ( model + dt / 5000, Cmd.none )


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  onAnimationFrameDelta (\dt -> Delta dt)


-- VIEW

view : Model -> Html Msg
view theta =
  WebGL.toHtml
    [ width 400
    , height 400
    , style "display" "block"
    ]
    [ WebGL.entity
        vertexShader
        fragmentShader
        (sphere 10 12 6)
        (uniforms theta)
    ]


-- UNIFORMS

type alias Uniforms =
  { rotation : Mat4
  , perspective : Mat4
  , camera : Mat4
  , shade : Float
  }

uniforms : Float -> Uniforms
uniforms theta =
  { rotation =
      Mat4.mul
        (Mat4.makeRotate (3 * theta) (vec3 0 0 1))
        (Mat4.makeRotate (4 * theta) (vec3 1 0 0))
  , perspective = Mat4.makePerspective 45 1 10.0 100
  , camera = Mat4.makeLookAt (vec3 0 0 50) (vec3 0 0 0) (vec3 0 1 0)
  , shade = 0.8
  }


-- MESH

type alias Vertex =
  { color : Vec3
  , position : Vec3
  }

toCC : Float -> Float -> Float -> Vec3
toCC r theta phi =
  vec3
    (r * (cos <| degrees <| theta) * (cos <| degrees <| phi))
    (r * (sin <| degrees <| theta) * (cos <| degrees <| phi))
    (r * (sin <| degrees <| phi))

toRGB : Float -> Float -> Vec3
toRGB theta phi =
  vec3
    ((cos theta * (cos phi) + 1.0) / 2.0)
    ((sin theta * (cos phi) + 1.0) / 2.0)
    ((sin phi + 1.0) / 2.0)


face : Float -> Int -> Int -> ( Int, Int ) -> List ( Vertex, Vertex, Vertex )
face r m n (j, i) =
  let
    theta = toFloat i * 360.0 / (toFloat m)
    thetaNext = toFloat (i + 1) * 360.0 / (toFloat m)
    phi = toFloat j * 180.0 / (toFloat n) - 90.0
    phiNext = toFloat (j + 1) * 180.0 / (toFloat n) - 90.0
  in
    if j == 0 then
      [ ( (Vertex (toRGB theta phi) (toCC r theta phi))
        , (Vertex (toRGB thetaNext phiNext) (toCC r thetaNext phiNext))
        , (Vertex (toRGB theta phiNext) (toCC r theta phiNext))
        )
      ]
    else if j < (n - 1) then
      [ ( (Vertex (toRGB theta phi) (toCC r theta phi))
        , (Vertex (toRGB thetaNext phi) (toCC r thetaNext phi))
        , (Vertex (toRGB thetaNext phiNext) (toCC r thetaNext phiNext))
        )
      ,
        ( (Vertex (toRGB thetaNext phiNext) (toCC r thetaNext phiNext))
        , (Vertex (toRGB theta phiNext) (toCC r theta phiNext))
        , (Vertex (toRGB theta phi) (toCC r theta phi))
        )
      ]
    else
      [ ( (Vertex (toRGB thetaNext phiNext) (toCC r thetaNext phiNext))
        , (Vertex (toRGB theta phi) (toCC r theta phi))
        , (Vertex (toRGB thetaNext phi) (toCC r thetaNext phi))
        )
      ]

sphere : Float -> Int -> Int -> Mesh Vertex
sphere r m n =
  let
    pair : List Int -> List ( Int, Int )
    pair xs = indexedMap Tuple.pair xs

    position : List (List ( Int, Int ))
    position = (map pair (map (repeat n) (range 0 (m - 1))))
  in
    map (face r m n) (concat position)
      |> concat
      |> WebGL.triangles


-- SHADERS

vertexShader : Shader Vertex Uniforms { vcolor : Vec3}
vertexShader =
  [glsl|
    attribute vec3 position;
    attribute vec3 color;
    uniform mat4 rotation;
    uniform mat4 perspective;
    uniform mat4 camera;
    varying vec3 vcolor;
    void main () {
      gl_Position = perspective * camera * rotation * vec4(position, 1.0);
      vcolor = color;
    }
  |]

fragmentShader : Shader {} Uniforms { vcolor : Vec3 }
fragmentShader =
  [glsl|
    precision mediump float;
    uniform float shade;
    varying vec3 vcolor;
    void main () {
      gl_FragColor = shade * vec4(vcolor, 1.0);
    }
  |]
