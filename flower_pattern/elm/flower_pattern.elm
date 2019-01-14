import Browser
import Browser.Events exposing (onAnimationFrameDelta, onMouseMove)
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
import WebGL exposing (Mesh, Shader)


-- MAIN
main : Program () Model Msg
main =
  Browser.element
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
    , phase = vec3 0 0.2 0.4
    , frequency = vec3 20.0 20.0 20.0
    , time = 0
    , color =  vec3 0 0 0
    }
  , Cmd.none
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
subscriptions model =
  let
   dt = model.time
  in
    onAnimationFrameDelta (\t -> Delta t)


-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Delta dt ->
      ( { model | time = model.time + dt / 1000 }, Cmd.none )

    AmplitudeXChanged ampX ->
      ( { model | amplitude = Vec3.setX ampX model.amplitude }, Cmd.none )

    AmplitudeYChanged ampY ->
      ( { model | amplitude = Vec3.setY ampY model.amplitude }, Cmd.none )

    AmplitudeZChanged ampZ ->
      ( { model | amplitude = Vec3.setZ ampZ model.amplitude }, Cmd.none )

    PhaseXChanged phaseX ->
      ( { model | phase = Vec3.setX phaseX model.phase }, Cmd.none)

    PhaseYChanged phaseY ->
      ( { model | phase = Vec3.setY phaseY model.phase }, Cmd.none)

    PhaseZChanged phaseZ ->
      ( { model | phase = Vec3.setZ phaseZ model.phase }, Cmd.none)

    FrequencyXChanged frequencyX ->
      ( { model | frequency = Vec3.setX frequencyX model.frequency }, Cmd.none)

    FrequencyYChanged frequencyY ->
      ( { model | frequency = Vec3.setY frequencyY model.frequency }, Cmd.none)

    FrequencyZChanged frequencyZ ->
      ( { model | frequency = Vec3.setZ frequencyZ model.frequency }, Cmd.none)

type Msg
  = Delta Float
  | AmplitudeXChanged Float
  | AmplitudeYChanged Float
  | AmplitudeZChanged Float
  | PhaseXChanged Float
  | PhaseYChanged Float
  | PhaseZChanged Float
  | FrequencyXChanged Float
  | FrequencyYChanged Float
  | FrequencyZChanged Float


-- VIEW
view : Model -> Html Msg
view model =
  Element.layout
    [ Element.width Element.fill ]
    ( Element.column
        []
        [ header model
        , contents model
        , footer model
        ]
    )

header : Model -> Element.Element Msg
header model =
  Element.el
    [ Element.height <| Element.px <| 80
    , Element.width Element.fill
    , Element.paddingEach { top = 0, right = 0, bottom = 0, left = 10 }
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
    []
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
            AmplitudeXChanged
            PhaseXChanged
            FrequencyXChanged
            "Red"
            ( Element.rgb255 251 250 245 )
            ( Element.rgb255 255 0 0 )
            ( Vec3.getX model.amplitude )
            ( Vec3.getX model.phase )
            ( Vec3.getX model.frequency )
        , controler
            AmplitudeYChanged
            PhaseYChanged
            FrequencyYChanged
            "Green"
            ( Element.rgb255 48 40 51 )
            ( Element.rgb255 0 255 0 )
            ( Vec3.getY model.amplitude )
            ( Vec3.getY model.phase )
            ( Vec3.getY model.frequency )
        , controler
            AmplitudeZChanged
            PhaseZChanged
            FrequencyZChanged
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
            , min = 10.0
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
            , max = 2.0
            , min = 0.0
            , onChange = msgPhase
            , step = Just 0.1
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
            , min = 10.0
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
    ]
    ( Element.link
        [ Element.centerY ]
        { url = model.footer.url, label = Element.text model.footer.label} )

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
      float r = 0.01 / abs(0.5 + amplitude.x * sin((atan(p.y, p.x) + (time + phase.x) * 0.5) * frequency.x) * 0.01 - length(p));
      float g = 0.01 / abs(0.5 + amplitude.y * sin((atan(p.y, p.x) + (time + phase.y) * 0.5) * frequency.y) * 0.01 - length(p));
      float b = 0.01 / abs(0.5 + amplitude.z * sin((atan(p.y, p.x) + (time + phase.z) * 0.5) * frequency.z) * 0.01 - length(p));
      gl_FragColor = vec4(vec3(r, g, b), 1.0);
    }
  |]
