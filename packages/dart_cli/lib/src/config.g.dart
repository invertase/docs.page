// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Config _$ConfigFromJson(Map<String, dynamic> json) => Config(
      name: json['name'] as String?,
      theme: json['theme'] as String?,
      docsearch: json['docsearch'] == null
          ? null
          : DocSearch.fromJson(json['docsearch'] as Map<String, dynamic>),
      twitter: json['twitter'] as String?,
      sidebar:
          (json['sidebar'] as List<dynamic>?)?.map((e) => e as Object).toList(),
      googleTagManager: json['googleTagManager'] as String?,
      experimentalCodeHike: json['experimentalCodeHike'] as bool?,
      experimentalMath: json['experimentalMath'] as bool?,
    );

Map<String, dynamic> _$ConfigToJson(Config instance) => <String, dynamic>{
      'name': instance.name,
      'theme': instance.theme,
      'twitter': instance.twitter,
      'sidebar': instance.sidebar,
      'docsearch': instance.docsearch,
      'googleTagManager': instance.googleTagManager,
      'experimentalCodeHike': instance.experimentalCodeHike,
      'experimentalMath': instance.experimentalMath,
    };

DocSearch _$DocSearchFromJson(Map<String, dynamic> json) => DocSearch(
      apiKey: json['apiKey'] as String,
      indexName: json['indexName'] as String,
    );

Map<String, dynamic> _$DocSearchToJson(DocSearch instance) => <String, dynamic>{
      'apiKey': instance.apiKey,
      'indexName': instance.indexName,
    };
