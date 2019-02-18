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
import List exposing (concat, indexedMap, map, range, repeat)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 as Vec3 exposing (vec3, Vec3)
import Math.Vector4 as Vec4 exposing (Vec4)
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
  ( { header = "Torus"
    , footer =
        { label = "back >"
        , url = "../index.html"
        }
    , webglResolution =
        { height = 512
        , width = 512
        }
    , torus =
        { majorRadius = 10
        , minorRadius = 3
        , majorCircleSegment = 12
        , minorCircleSegment = 12
        }
    , windowResolution =
        { height = 600
        , width = 600
        }
    , time = 0
    }
    , Task.perform GetViewport Dom.getViewport
  )

type alias Model =
  { header : String
  , footer : Footer
  , webglResolution : Resolution
  , torus : Torus
  , windowResolution : Resolution
  , time : Float
  }

type alias Footer =
  { label : String
  , url : String
  }

type alias Resolution =
  { height : Int
  , width : Int
  }

type alias Torus =
  { majorRadius : Float
  , minorRadius : Float
  , majorCircleSegment : Int
  , minorCircleSegment : Int
  }


-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.batch
    [ onResize SetWindowSize
    , onAnimationFrameDelta Delta
    ]


-- UPDATE
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    GetViewport viewport ->
      ( { model |
            windowResolution =
              { width = round viewport.viewport.width
              , height = round viewport.viewport.height
              }
        }
        , Cmd.none
      )

    SetWindowSize width height ->
      ( { model |
            windowResolution =
              { width = width
              , height = height
              }
        }
        , Cmd.none
      )

    MajorRadiusChanged radius ->
      ( { model |
            torus =
              { majorRadius = radius
              , minorRadius = model.torus.minorRadius
              , majorCircleSegment = model.torus.majorCircleSegment
              , minorCircleSegment = model.torus.minorCircleSegment
              }
        }
        , Cmd.none
        )

    MinorRadiusChanged radius ->
      ( { model |
            torus =
              { majorRadius = model.torus.majorRadius
              , minorRadius = radius
              , majorCircleSegment = model.torus.majorCircleSegment
              , minorCircleSegment = model.torus.minorCircleSegment
              }
        }
        , Cmd.none
        )

    MajorCircleSegmentChanged segment ->
      ( { model |
            torus =
              { majorRadius = model.torus.majorRadius
              , minorRadius = model.torus.minorRadius
              , majorCircleSegment = segment |> round
              , minorCircleSegment = model.torus.minorCircleSegment
              }
        }
        , Cmd.none
        )

    MinorCircleSegmentChanged segment ->
      ( { model |
            torus =
              { majorRadius = model.torus.majorRadius
              , minorRadius = model.torus.minorRadius
              , majorCircleSegment = model.torus.majorCircleSegment
              , minorCircleSegment = segment |> round
              }
        }
        , Cmd.none
        )

    Delta dt ->
      ( { model | time = (model.time + dt / 10) |> round |> modBy 360 |> toFloat }, Cmd.none )

type Msg
  = GetViewport Dom.Viewport
  | SetWindowSize Int Int
  | MajorRadiusChanged Float
  | MinorRadiusChanged Float
  | MajorCircleSegmentChanged Float
  | MinorCircleSegmentChanged Float
  | Delta Float


-- VIEW
view : Model -> Browser.Document Msg
view model =
  { title = "Torus"
  , body =
      [ Element.layout
          []
          ( Element.column
              [ Element.width <| Element.px <| model.windowResolution.width
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
    , Element.width <| Element.px <| model.windowResolution.width
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
    [ Element.paddingEach { top = 0, right = 0, bottom = 80, left = 0 }
    , Element.htmlAttribute (Attributes.style "margin" "auto")
    ]
    [ Element.html
        ( WebGL.toHtml
            [ Attributes.height model.webglResolution.height
            , Attributes.width model.webglResolution.width
            , Attributes.style "margin" "auto"
            ]
            [ WebGL.entity
                vertexShader
                fragmentShader
                ( torus model.torus )
                ( uniforms model )
            ]
        )
    , controler
        MajorRadiusChanged
        MinorRadiusChanged
        MajorCircleSegmentChanged
        MinorCircleSegmentChanged
        model.torus
    ]

controler : (Float -> Msg) -> (Float -> Msg) -> (Float -> Msg) -> (Float -> Msg) -> Torus -> Element.Element Msg
controler msgMajorRadius msgMinorRadius msgMajorCircleSegment msgMinorCircleSegment torusModel =
  Element.row
    [ Element.padding 20
    , Element.spacing 10
    , Element.htmlAttribute (Attributes.style "margin" "auto")
    ]
    [ Element.el
        [ Element.height Element.fill
        , Element.width Element.fill
        , Element.padding 5
        , Font.color <| Element.rgb255 251 250 245
        , Background.color <| Element.rgb255 0 110 84
        ]
        ( Element.el
            [ Element.centerY
            , Element.centerX
            ]
            ( Element.text "Parameter" )
        )
    , Element.column
        [ Element.spacing 10
        , Element.centerY
        ]
        [ parameterUI
            { path = "img/major_radius.png"
            , description = "Major Radius"
            }
            { max = 12.0
            , min = 8.0
            , step = Just 1.0
            }
            msgMajorRadius
            torusModel.majorRadius
        , parameterUI
            { path = "img/minor_radius.png"
            , description = "Minor Radius"
            }
            { max = 7.0
            , min = 1.0
            , step = Just 1.0
            }
            msgMinorRadius
            torusModel.minorRadius
        , parameterUI
            { path = "img/major_circle_segment.png"
            , description = "Major Circle Segment"
            }
            { max = 60.0
            , min = 3.0
            , step = Just 1.0
            }
            msgMajorCircleSegment
            (toFloat torusModel.majorCircleSegment)
        , parameterUI
            { path = "img/minor_circle_segment.png"
            , description = "Minor Circle Segment"
            }
            { max = 60.0
            , min = 3.0
            , step = Just 1.0
            }
            msgMinorCircleSegment
            (toFloat torusModel.minorCircleSegment)
        ]
    ]

type alias ImageConfig =
  { path : String
  , description : String
  }

type alias SliderConfig =
  { max : Float
  , min : Float
  , step : Maybe Float
  }

parameterUI : ImageConfig -> SliderConfig -> ( Float -> Msg ) -> Float -> Element.Element Msg
parameterUI imageConfig sliderConfig msg modelParameter =
  Element.row
    []
    [ Element.image
        [ Element.height <| Element.px <| 64
        , Element.width <| Element.px <| 64
        , Element.htmlAttribute (Attributes.style "image-rendering" "pixelated")
        ]
        { src = imageConfig.path
        , description = imageConfig.description
        }
    , Input.slider
        [ Element.width <| Element.px <| 200
        , Element.height <| Element.px <| 5
        , Background.color <| Element.rgb255 192 192 192
        , Border.rounded 5
        , Element.alignBottom
        ]
        { label =
            Input.labelAbove
              [ Element.alignRight ]
              (Element.text <| String.fromFloat modelParameter)
        , max = sliderConfig.max
        , min = sliderConfig.min
        , onChange = msg
        , step = sliderConfig.step
        , thumb = Input.defaultThumb
        , value = modelParameter
        }
    ]

type alias Vertex =
  { position : Vec3
  , color : Vec3
  , normal : Vec3
  }

vertex : Vec3 -> Vec3 -> Vec3 -> Vertex
vertex position color normal =
  { position = position
  , color = color
  , normal = normal
  }

getX : Float -> Float -> Float -> Float -> Float
getX majorRadius minorRadius theta phi =
  majorRadius * (cos theta) + minorRadius * (cos theta) * (cos phi)

getY : Float -> Float -> Float -> Float -> Float
getY majorRadius minorRadius theta phi =
  majorRadius * (sin theta) + minorRadius * (sin theta) * (cos phi)

getZ : Float -> Float -> Float
getZ minorRadius phi =
  minorRadius * (sin phi)

getR : Float -> Float -> Float
getR theta phi =
  ((cos theta) + (cos theta) * (cos phi) + 2.0) / 4.0

getG : Float -> Float -> Float
getG theta phi =
  ((sin theta) + (sin theta) * (cos phi) + 2.0) / 4.0

getB : Float -> Float
getB phi =
  (sin phi + 1.0) / 2.0

getNormX : Float -> Float -> Float
getNormX theta phi =
  (cos theta) * (cos phi)

getNormY : Float -> Float -> Float
getNormY theta phi =
  (sin theta) * (cos phi)

getNormZ : Float -> Float
getNormZ phi =
  sin phi

normalize : Float -> Float -> Float -> Vec3
normalize x y z =
  let
    norm = sqrt (x ^ 2 + y ^ 2 + z ^ 2)
  in
    vec3 (x / norm) (y / norm) (z / norm)

getRadian : Int -> Int -> Float
getRadian index segment =
  if index == segment then
      0.0
  else
      360.0 * (toFloat index) / (toFloat segment) |> degrees

face : Torus -> (Int, Int) -> List ( Vertex, Vertex, Vertex )
face torusModel ( indexTheta, indexPhi ) =
  let
    theta = getRadian indexTheta torusModel.majorCircleSegment
    phi = getRadian indexPhi torusModel.minorCircleSegment
    thetaNext = getRadian (indexTheta + 1) torusModel.majorCircleSegment
    phiNext = getRadian (indexPhi + 1) torusModel.minorCircleSegment
  in
    [ ( vertex
          (vec3
            (getX torusModel.majorRadius torusModel.minorRadius theta phiNext)
            (getY torusModel.majorRadius torusModel.minorRadius theta phiNext)
            (getZ torusModel.minorRadius phiNext)
          )
          (vec3 (getR theta phiNext) (getG theta phiNext) (getB phiNext))
          (normalize (getNormX theta phiNext) (getNormY theta phiNext) (getNormZ phiNext))
      , vertex
          (vec3
            (getX torusModel.majorRadius torusModel.minorRadius theta phi)
            (getY torusModel.majorRadius torusModel.minorRadius theta phi)
            (getZ torusModel.minorRadius phi)
          )
          (vec3 (getR theta phi) (getG theta phi) (getB phi))
          (normalize (getNormX theta phi) (getNormY theta phi) (getNormZ phi))
      , vertex
          (vec3
            (getX torusModel.majorRadius torusModel.minorRadius thetaNext phi)
            (getY torusModel.majorRadius torusModel.minorRadius thetaNext phi)
            (getZ torusModel.minorRadius phi)
          )
          (vec3 (getR thetaNext phi) (getG thetaNext phi) (getB phi))
          (normalize (getNormX thetaNext phi) (getNormY thetaNext phi) (getNormZ phi))
      )
    , ( vertex
          (vec3
            (getX torusModel.majorRadius torusModel.minorRadius theta phiNext)
            (getY torusModel.majorRadius torusModel.minorRadius theta phiNext)
            (getZ torusModel.minorRadius phiNext)
          )
          (vec3 (getR theta phiNext) (getG theta phiNext) (getB phiNext))
          (normalize (getNormX theta phiNext) (getNormY theta phiNext) (getNormZ phiNext))
      , vertex
          (vec3
            (getX torusModel.majorRadius torusModel.minorRadius thetaNext phi)
            (getY torusModel.majorRadius torusModel.minorRadius thetaNext phi)
            (getZ torusModel.minorRadius phi)
          )
          (vec3 (getR thetaNext phi) (getG thetaNext phi) (getB phi))
          (normalize (getNormX thetaNext phi) (getNormY thetaNext phi) (getNormZ phi))
      , vertex
          (vec3
            (getX torusModel.majorRadius torusModel.minorRadius thetaNext phiNext)
            (getY torusModel.majorRadius torusModel.minorRadius thetaNext phiNext)
            (getZ torusModel.minorRadius phiNext)
          )
          (vec3 (getR thetaNext phiNext) (getG thetaNext phiNext) (getB phiNext))
          (normalize (getNormX thetaNext phiNext) (getNormY thetaNext phiNext) (getNormZ phiNext))
      )
    ]

torus : Torus -> Mesh Vertex
torus torusModel =
  let
    indexTheta = range 0 (torusModel.majorCircleSegment - 1)

    swap ( i, j ) = ( j, i )

    pair xs =
      xs
        |> indexedMap Tuple.pair
        |> map swap

    indexPair =
      indexTheta
        |> map (repeat torusModel.minorCircleSegment)
        |> map pair
        |> concat
  in
    map (face torusModel) indexPair
      |> concat
      |> WebGL.triangles


-- UNIFORMS
type alias Uniforms =
  { mvpMatrix : Mat4
  , invMatrix : Mat4
  , lightDirection : Vec3
  , eyeDirection: Vec3
  }

uniforms : Model -> Uniforms
uniforms model =
  let
    rotation =
      Mat4.mul
        (Mat4.makeRotate (degrees 30.0) (vec3 0 0 1))
        (Mat4.makeRotate (degrees -30.0) (vec3 1 0 0))
    perspective = Mat4.makePerspective 45 1 5.0 100
    camera = Mat4.makeLookAt (vec3 0 0 50) (vec3 0 0 0) (vec3 0 1 0)
    mvpMat = Mat4.mul perspective <| Mat4.mul camera rotation
  in
    { mvpMatrix = mvpMat
    , invMatrix = Mat4.inverseOrthonormal mvpMat
    , lightDirection = normalize (cos <| degrees <| model.time) (sin <| degrees <| model.time) -1.0
    , eyeDirection = normalize 1.0 1.0 -1.0
    }


footer : Model -> Element.Element Msg
footer model =
  Element.el
    [ Element.height <| Element.px <| 80
    , Element.width <| Element.px <| model.windowResolution.width
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


-- SHADERS
vertexShader : Shader Vertex Uniforms { vColor : Vec4, vNormal : Vec3}
vertexShader =
  [glsl|
    attribute vec3 position;
    attribute vec3 color;
    attribute vec3 normal;
    uniform mat4 mvpMatrix;
    varying vec4 vColor;
    varying vec3 vNormal;

    void main (void) {
      vColor = vec4(color, 1.0);
      vNormal = normal;
      gl_Position = mvpMatrix * vec4(position, 1.0);
    }
  |]

fragmentShader : Shader {} Uniforms { vColor : Vec4, vNormal : Vec3 }
fragmentShader =
  [glsl|
    precision mediump float;

    uniform mat4 invMatrix;
    uniform vec3 lightDirection;
    uniform vec3 eyeDirection;
    varying vec4 vColor;
    varying vec3 vNormal;

    void main (void) {
      vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
      vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
      vec3 halfLE = normalize(invLight + invEye);
      float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);
      float specular = pow(clamp(dot(vNormal, halfLE), 0.0, 1.0), 50.0);
      vec4 destColor = vColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + vec4(0.1, 0.1, 0.1, 1.0);
      gl_FragColor = destColor;
    }
  |]
