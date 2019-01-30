import Browser
import Browser.Dom as Dom
import Browser.Events exposing (onAnimationFrameDelta, onResize)
import Element
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Html exposing (Html)
import Html.Attributes as Attributes
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (vec2, Vec2)
import Math.Vector3 as Vec3 exposing (vec3, Vec3)
import Task
import WebGL exposing (Mesh, Shader)


-- MAIN
main : Program () Model Msg
main =
  Browser.document
    { init = init
    , subscriptions = subscriptions
    , update = update
    , view = view
    }


-- INIT
init : () -> ( Model, Cmd Msg )
init _ =
  ( { header = "Flower Pattern"
    , footer =
        { label = "back >"
        , url = "../index.html"
        }
    , resolution =
        { height = 512
        , width = 512
        }
    , amplitude = vec3 20.0 20.0 20.0
    , phase = vec3 0 5.0 10.0
    , frequency = vec3 5.0 5.0 5.0
    , time = 0
    , color =  vec3 0 0 0
    , width = 600
    , height = 600
    }
  , Task.perform GetViewport Dom.getViewport
  )

type alias Model =
  { header : String
  , footer : Footer
  , resolution : Resolution
  , amplitude : Vec3
  , phase : Vec3
  , frequency : Vec3
  , time : Float
  , color : Vec3
  , width : Int
  , height : Int
  }

type alias Footer =
  { label : String
  , url : String
  }

type alias Resolution =
  { height : Int
  , width : Int
  }


-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.batch
    [ onAnimationFrameDelta Delta
    , onResize SetWindowSize
    ]


-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Delta dt ->
      ( { model | time = model.time + dt / 1000 }, Cmd.none )

    AmplitudeRChanged ampR ->
      ( { model | amplitude = Vec3.setX ampR model.amplitude }, Cmd.none )

    AmplitudeGChanged ampG ->
      ( { model | amplitude = Vec3.setY ampG model.amplitude }, Cmd.none )

    AmplitudeBChanged ampB ->
      ( { model | amplitude = Vec3.setZ ampB model.amplitude }, Cmd.none )

    PhaseRChanged phaseR ->
      ( { model | phase = Vec3.setX phaseR model.phase }, Cmd.none )

    PhaseGChanged phaseG ->
      ( { model | phase = Vec3.setY phaseG model.phase }, Cmd.none )

    PhaseBChanged phaseB ->
      ( { model | phase = Vec3.setZ phaseB model.phase }, Cmd.none )

    FrequencyRChanged frequencyR ->
      ( { model | frequency = Vec3.setX frequencyR model.frequency }, Cmd.none )

    FrequencyGChanged frequencyG ->
      ( { model | frequency = Vec3.setY frequencyG model.frequency }, Cmd.none )

    FrequencyBChanged frequencyB ->
      ( { model | frequency = Vec3.setZ frequencyB model.frequency }, Cmd.none )

    SetWindowSize width height ->
      ( { model | width = width, height = height }, Cmd.none )

    GetViewport viewport ->
      ( { model
            | width = round viewport.viewport.width
            , height = round viewport.viewport.height
        }
        , Cmd.none
      )

type Msg
  = Delta Float
  | AmplitudeRChanged Float
  | AmplitudeGChanged Float
  | AmplitudeBChanged Float
  | PhaseRChanged Float
  | PhaseGChanged Float
  | PhaseBChanged Float
  | FrequencyRChanged Float
  | FrequencyGChanged Float
  | FrequencyBChanged Float
  | SetWindowSize Int Int
  | GetViewport Dom.Viewport


-- VIEW
view : Model -> Browser.Document Msg
view model =
  { title = "Flower Pattern"
  , body =
      [ Element.layout
          []
          ( Element.column
              [ Element.width <| Element.px <| model.width
              , Element.centerX
              , Font.family
                  [ Font.typeface "Arial"
                  , Font.sansSerif
                  ]
              ]
              [ header model
              , contents model
              , footer model
              ]
          )
      ]
  }

header : Model -> Element.Element Msg
header model =
  Element.el
    [ Element.height <| Element.px <| 80
    , Element.width Element.fill
    , Element.paddingEach { top = 0, right = 0, bottom = 0, left = 10 }
    , Font.size 32
    , Font.color <| Element.rgb255 251 250 245
    , Background.color <| Element.rgb255 0 110 84
    ]
    ( Element.el
        [ Element.centerY ]
        (Element.text model.header)
    )

contents : Model -> Element.Element Msg
contents model =
  Element.column
    [ Element.paddingEach { top =0, right = 0, bottom = 80, left = 0 }
    , Element.htmlAttribute (Attributes.style "margin" "auto")
    ]
    [ Element.html
        ( WebGL.toHtml
            [ Attributes.height model.resolution.height
            , Attributes.width model.resolution.width
            , Attributes.style "margin" "auto"
            ]
            [ WebGL.entity
                vertexShader
                fragmentShader
                mesh
                ( uniforms
                    model.resolution.height
                    model.resolution.width
                    model.amplitude
                    model.phase
                    model.frequency
                    model.time
                )
            ]
        )
    , Element.row
        []
        [ controler
            AmplitudeRChanged
            PhaseRChanged
            FrequencyRChanged
            "Red"
            ( Element.rgb255 251 250 245 )
            ( Element.rgb255 255 0 0 )
            ( Vec3.getX model.amplitude )
            ( Vec3.getX model.phase )
            ( Vec3.getX model.frequency )
        , controler
            AmplitudeGChanged
            PhaseGChanged
            FrequencyGChanged
            "Green"
            ( Element.rgb255 48 40 51 )
            ( Element.rgb255 0 255 0 )
            ( Vec3.getY model.amplitude )
            ( Vec3.getY model.phase )
            ( Vec3.getY model.frequency )
        , controler
            AmplitudeBChanged
            PhaseBChanged
            FrequencyBChanged
            "Blue"
            ( Element.rgb255 251 250 245 )
            ( Element.rgb255 0 0 255 )
            ( Vec3.getZ model.amplitude )
            ( Vec3.getZ model.phase )
            ( Vec3.getZ model.frequency )
        ]
    ]

type alias Vertex =
  { position : Vec3 }

vertex : Float -> Float -> Float -> Vertex
vertex x y z =
  { position = vec3 x y z }

mesh : Mesh Vertex
mesh =
  [ ( vertex -1 1 0
    , vertex -1 -1 0
    , vertex 1 -1 0
    )
  , ( vertex -1 1 0
    , vertex 1 -1 0
    , vertex 1 1 0
    )
  ]
    |> WebGL.triangles

type alias Uniforms =
  { resolution : Vec2
  , amplitude : Vec3
  , phase : Vec3
  , frequency : Vec3
  , time : Float
  }

uniforms : Int -> Int -> Vec3 -> Vec3 -> Vec3 -> Float -> Uniforms
uniforms height width amplitude phase frequency time =
  { resolution = vec2 (toFloat height) (toFloat width)
  , amplitude = amplitude
  , phase = phase
  , frequency = frequency
  , time = time
  }

controler : (Float -> Msg) -> (Float -> Msg) -> (Float -> Msg) -> String -> Element.Color -> Element.Color -> Float -> Float -> Float -> Element.Element Msg
controler msgAmplitude msgPhase msgFrequency colorLabel fontColor bgColor amplitude phase frequency =
  Element.row
    [ Element.padding 20
    , Element.spacing 10
    ]
    [ Element.el
        [ Element.height Element.fill
        , Element.width <| Element.px <| 80
        , Element.padding 5
        -- , Font.color <| Element.rgb255 251 250 245
        , Font.color fontColor
        , Background.color bgColor
        ]
        ( Element.el
            [ Element.centerY
            , Element.centerX
            ]
            ( Element.text colorLabel ) )
    , Element.column
        [ Element.spacing 20
        , Element.centerY
        ]
        [ Input.slider
            [ Element.width Element.fill
            , Element.height <| Element.px <| 2
            , Background.color <| Element.rgb255 192 192 192
            , Border.rounded 2
            ]
            { label = Input.labelAbove [] (Element.text <| "Amplitude: " ++ String.fromFloat amplitude)
            , max = 40.0
            , min = 1.0
            , onChange = msgAmplitude
            , step = Just 1.0
            , thumb = Input.defaultThumb
            , value = amplitude
            }
        , Input.slider
            [ Element.width Element.fill
            , Element.height <| Element.px <| 2
            , Background.color <| Element.rgb255 192 192 192
            , Border.rounded 2
            ]
            { label = Input.labelAbove [] (Element.text <| "Phase: " ++ String.fromFloat phase)
            , max = 30.0
            , min = 0.0
            , onChange = msgPhase
            , step = Just 1.0
            , thumb = Input.defaultThumb
            , value = phase
            }
        , Input.slider
            [ Element.width Element.fill
            , Element.height <| Element.px <| 2
            , Background.color <| Element.rgb255 192 192 192
            , Border.rounded 2
            ]
            { label = Input.labelAbove [] (Element.text <| "Frequency: " ++ String.fromFloat frequency)
            , max = 30.0
            , min = 3.0
            , onChange = msgFrequency
            , step = Just 1.0
            , thumb = Input.defaultThumb
            , value = frequency
            }
        ]
    ]

footer : Model -> Element.Element Msg
footer model =
  Element.el
    [ Element.height <| Element.px <| 80
    , Element.width Element.fill
    , Element.paddingEach { top = 0, right = 0, bottom = 0, left = 10 }
    , Font.color <| Element.rgb255 251 250 245
    , Background.color <| Element.rgb255 0 110 84
    , Element.htmlAttribute (Attributes.style "position" "fixed")
    , Element.htmlAttribute (Attributes.style "bottom" "0")
    ]
    ( Element.link
        [ Element.centerY
        , Font.size 32
        ]
        { url = model.footer.url, label = Element.text model.footer.label}
    )

vertexShader : Shader Vertex Uniforms {}
vertexShader =
  [glsl|
    attribute vec3 position;
    void main () {
      gl_Position = vec4(position, 1.0);
    }
  |]

fragmentShader : Shader {} Uniforms {}
fragmentShader =
  [glsl|
    precision mediump float;
    uniform vec2 resolution;
    uniform vec3 amplitude;
    uniform vec3 phase;
    uniform vec3 frequency;
    uniform float time;
    void main () {
      vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      float r = 0.01 / abs(0.5 + amplitude.x * sin((atan(p.y, p.x) + (time + phase.x) * 0.1) * frequency.x) * 0.01 - length(p));
      float g = 0.01 / abs(0.5 + amplitude.y * sin((atan(p.y, p.x) + (time + phase.y) * 0.1) * frequency.y) * 0.01 - length(p));
      float b = 0.01 / abs(0.5 + amplitude.z * sin((atan(p.y, p.x) + (time + phase.z) * 0.1) * frequency.z) * 0.01 - length(p));
      gl_FragColor = vec4(vec3(r, g, b), 1.0);
    }
  |]
