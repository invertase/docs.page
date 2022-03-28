// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'typedoc.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Node _$NodeFromJson(Map<String, dynamic> json) => Node(
      id: json['id'] as int?,
      name: json['name'] as String?,
      kind: json['kind'] as int?,
      flags: (json['flags'] as Map<String, dynamic>?)?.map(
        (k, e) => MapEntry(k, e as bool),
      ),
      children: (json['children'] as List<dynamic>?)
          ?.map((e) => Node.fromJson(e as Map<String, dynamic>))
          .toList(),
      groups: (json['groups'] as List<dynamic>?)
          ?.map((e) => Group.fromJson(e as Map<String, dynamic>))
          .toList(),
      kindString: json['kindString'] as String?,
      sources: (json['sources'] as List<dynamic>?)
          ?.map((e) => Source.fromJson(e as Map<String, dynamic>))
          .toList(),
      comment: json['comment'] == null
          ? null
          : Comment.fromJson(json['comment'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$NodeToJson(Node instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'kind': instance.kind,
      'kindString': instance.kindString,
      'flags': instance.flags,
      'children': instance.children,
      'groups': instance.groups,
      'sources': instance.sources,
      'comment': instance.comment,
    };

Group _$GroupFromJson(Map<String, dynamic> json) => Group(
      title: json['title'] as String,
      kind: json['kind'] as int,
      children:
          (json['children'] as List<dynamic>).map((e) => e as int).toList(),
    );

Map<String, dynamic> _$GroupToJson(Group instance) => <String, dynamic>{
      'title': instance.title,
      'kind': instance.kind,
      'children': instance.children,
    };

Source _$SourceFromJson(Map<String, dynamic> json) => Source(
      fileName: json['fileName'] as String,
      line: json['line'] as int,
      character: json['character'] as int,
    );

Map<String, dynamic> _$SourceToJson(Source instance) => <String, dynamic>{
      'fileName': instance.fileName,
      'line': instance.line,
      'character': instance.character,
    };

Comment _$CommentFromJson(Map<String, dynamic> json) => Comment(
      shortText: json['shortText'] as String?,
      text: json['text'] as String?,
      tags: (json['tags'] as List<dynamic>?)
          ?.map((e) => Tag.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$CommentToJson(Comment instance) => <String, dynamic>{
      'shortText': instance.shortText,
      'text': instance.text,
      'tags': instance.tags,
    };

Tag _$TagFromJson(Map<String, dynamic> json) => Tag(
      tag: json['tag'] as String,
      text: json['text'] as String,
    );

Map<String, dynamic> _$TagToJson(Tag instance) => <String, dynamic>{
      'tag': instance.tag,
      'text': instance.text,
    };
